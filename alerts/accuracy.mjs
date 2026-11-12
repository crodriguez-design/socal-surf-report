/* =====================================================================
   Weekly accuracy check — run by alerts/check.mjs on Monday mornings (or
   any time with FORCE_ACCURACY=1). Re-runs the checks in
   research/accuracy-checks.md against the last few days of real data:

   1. WAVES: CDIP nearshore forecast (the ECMWF run the app uses) and the
      buoy-fed nowcast vs. what nearshore buoys actually measured.
   2. WIND: HRRR vs. NOAA station wind — mainly, did it call onshore vs.
      offshore right?

   Returns { ok, lines, problems }. check.mjs opens a GitHub issue only when
   something has drifted past the LIMITS below.
   ===================================================================== */
const LIMITS = {
  waveRatio: [0.8, 1.25],     // model ÷ measured outside this = drift
  windAgree: 0.8,             // onshore/offshore call right at least this often
};
const CDIP = "https://thredds.cdip.ucsd.edu/thredds/dodsC/cdip";
const WAVE_SITES = [          // nearshore buoy ↔ the MOP point next to it
  { buoy: "103", name: "Topanga Nearshore", mop: "L0806" },
  { buoy: "284", name: "Capistrano Beach Nearshore", mop: "OC106" },
];
const WIND_STATIONS = [       // NOAA CO-OPS stations with a wind sensor; facing = a nearby beach
  { id: "9410840", name: "Santa Monica", lat: 34.0083, lon: -118.5, facing: 215 },
  { id: "9411340", name: "Santa Barbara", lat: 34.405, lon: -119.692, facing: 180 },
];

const text = async u => { const r = await fetch(u, { signal: AbortSignal.timeout(60000) }); if (!r.ok) throw new Error(`${r.status} ${u.split("?")[0]}`); return r.text(); };
const json = async u => JSON.parse(await text(u));
const arr = (t, n) => { const m = t.match(new RegExp(`${n}\\[\\d+\\]\\n([^\\n]+)`)); return m ? m[1].split(",").map(Number) : []; };
const interp = (T, H, t) => { const j = T.findIndex(x => x >= t); if (j <= 0) return null; const f = (t - T[j-1]) / (T[j] - T[j-1]); return H[j-1] + (H[j] - H[j-1]) * f; };
const angd = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;

export async function runAccuracyCheck(days = 4) {
  const lines = [], problems = [];
  const since = Date.now() / 1000 - days * 86400;

  // ---- 1. waves ----
  for (const s of WAVE_SITES) {
    try {
      const dds = await text(`${CDIP}/realtime/${s.buoy}p1_rt.nc.dds`);
      const n = +dds.match(/waveTime\[waveTime = (\d+)\]/)[1], k = Math.min(n, days * 48 + 10);
      const bt = await text(`${CDIP}/realtime/${s.buoy}p1_rt.nc.ascii?waveTime%5B${n-k}:1:${n-1}%5D,waveHs%5B${n-k}:1:${n-1}%5D`);
      const T = arr(bt, "waveTime"), H = arr(bt, "waveHs");
      const pts = T.map((t, i) => [t, H[i]]).filter(([t, h]) => t >= since && h > 0);
      const cmp = async (file, slice = "") => {
        const t = await text(`${CDIP}/model/MOP_alongshore/${s.mop}_${file}.nc.ascii?waveTime${slice},waveHs${slice}`);
        const mT = arr(t, "waveTime"), mH = arr(t, "waveHs");
        const pr = pts.map(([t, h]) => [h, interp(mT, mH, t)]).filter(([, m]) => m);
        return pr.length ? { ratio: avg(pr.map(([h, m]) => m / h)), err: avg(pr.map(([h, m]) => Math.abs(m - h))) * 3.281, n: pr.length } : null;
      };
      const nd = await text(`${CDIP}/model/MOP_alongshore/${s.mop}_nowcast.nc.dds`);
      const nn = +nd.match(/waveTime = (\d+)/)[1], ns = `%5B${Math.max(0, nn - days*24 - 5)}:1:${nn-1}%5D`;
      const fc = await cmp("ecmwf_fc"), now = await cmp("nowcast", ns);
      lines.push(`Waves @ ${s.name}: forecast ${fc ? `×${fc.ratio.toFixed(2)} (±${fc.err.toFixed(1)} ft)` : "n/a"}, nowcast ${now ? `×${now.ratio.toFixed(2)} (±${now.err.toFixed(1)} ft)` : "n/a"} vs measured`);
      for (const [label, r] of [["forecast", fc], ["nowcast", now]])
        if (r && (r.ratio < LIMITS.waveRatio[0] || r.ratio > LIMITS.waveRatio[1]))
          problems.push(`${s.name}: ${label} is running ${r.ratio < 1 ? "low" : "high"} (×${r.ratio.toFixed(2)} of measured)`);
    } catch (e) { lines.push(`Waves @ ${s.name}: couldn't check (${e.message})`); }
  }

  // ---- 2. wind ----
  const fmt = d => d.toISOString().slice(0, 16).replace("T", " ").replace(/-/g, "");
  const end = new Date(), beg = new Date(Date.now() - 54 * 3600e3);
  for (const s of WIND_STATIONS) {
    try {
      const o = await json(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=wind&station=${s.id}&begin_date=${encodeURIComponent(fmt(beg))}&end_date=${encodeURIComponent(fmt(end))}&time_zone=gmt&units=english&format=json&application=surf_dashboard`);
      if (!o.data) { lines.push(`Wind @ ${s.name}: no station data`); continue; }
      const obs = {}; for (const r of o.data) if (r.t.endsWith(":00") && r.s && r.d) obs[r.t.slice(0, 13).replace(" ", "T")] = [+r.s, +r.d];
      const f = await json(`https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&hourly=wind_speed_10m,wind_direction_10m&models=gfs_hrrr&wind_speed_unit=kn&timezone=GMT&past_days=3&forecast_days=1`);
      const cls = d => angd(d, (s.facing + 180) % 360) <= 80 ? "off" : "on";
      const pr = f.hourly.time.map((t, i) => [obs[t.slice(0, 13)], [f.hourly.wind_speed_10m[i], f.hourly.wind_direction_10m[i]]]).filter(([ob, m]) => ob && m[0] != null && ob[0] >= 4);
      if (!pr.length) { lines.push(`Wind @ ${s.name}: not enough data`); continue; }
      const agree = avg(pr.map(([ob, m]) => cls(ob[1]) === cls(m[1]) ? 1 : 0)), bias = avg(pr.map(([ob, m]) => m[0] - ob[0]));
      lines.push(`Wind @ ${s.name}: onshore/offshore right ${Math.round(agree * 100)}% of the time, speed ${bias >= 0 ? "+" : ""}${bias.toFixed(1)} kt vs measured (n=${pr.length})`);
      if (agree < LIMITS.windAgree) problems.push(`${s.name}: HRRR called onshore vs offshore right only ${Math.round(agree * 100)}% of the time`);
    } catch (e) { lines.push(`Wind @ ${s.name}: couldn't check (${e.message})`); }
  }
  return { ok: problems.length === 0, lines, problems };
}
