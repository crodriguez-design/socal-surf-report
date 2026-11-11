/* =====================================================================
   model.js — SoCal Surf Check rating engine (shared by the app and the alert job).
   Spot config, data loading, surf-size model, tier scoring and the 72-h build.
   No page drawing in here: that lives in index.html.
   ===================================================================== */
/* =====================================================================
   SPOT CONFIG — edit this block to add / tune spots.
   ---------------------------------------------------------------------
   lat/lon      : the break (Open-Meteo picks the nearest sea grid cell)
   facing       : compass direction the beach faces, looking out to sea.
                  Offshore wind blows FROM facing+180.
   swellWindow  : [direction swell comes FROM, exposure 0..1] points used
                  to estimate how much of each offshore swell reaches the
                  break (island / headland shadowing). Linear between points.
   shadows      : extra cut for SHORT-period swell from an arc (islands
                  block short period; long period wraps). Full cut ≤10 s,
                  none ≥15 s.
   calib        : multiply the height estimate. Lower it if the page reads
                  bigger than what you actually see.
   tideStation  : NOAA CO-OPS id (tidesandcurrents.noaa.gov/map)
   buoy         : CDIP station id (optional; cdip.ucsd.edu), buoyName for display
   ===================================================================== */
const SPOTS = [
  /* ------------------------------------------------------------------
     HOW A SPOT IS DESCRIBED
     Geometry (used to ESTIMATE surf height from offshore model swell):
       facing, swellWindow, shadows, calib  — see comments above.
     criteria (used to RATE the surf): each factor lists the range(s) for
       perfect / good / mid. Anything outside "mid" = Don't Go.
       Ranges are inclusive [lo, hi]. dir ranges are compass degrees the
       swell comes FROM; several ranges = any of them.
       dir.combo     : top two swell trains each in one of these windows
                       (different windows) → direction counts as Perfect.
       tide.prefer   : "rising"/"falling" — the wrong direction drops a
                       Perfect tide to Good.
       wind.offshore : max kt for perfect/good/mid when wind is offshore or
                       cross-offshore. Above "mid" = Don't Go (too strong).
       wind.onshore  : max kt for good/mid when cross/onshore. Onshore is
                       never Perfect; under 4 kt any direction = Glassy (Perfect).
     All numbers come from spot-guide.md (research 2026-11-11). Tune them as
     your session reports come in.
     ------------------------------------------------------------------ */
  {
    id: "54th", name: "54th St, Newport", short: "54th St",
    lat: 33.6205, lon: -117.9478,    // beach end of 54th St (was ~1.3 km off, by the river mouth)
    facing: 220,              // SSW-facing; offshore = NE
    // Exposure for the HEIGHT estimate. W kept fairly high after a 2026-11-11 cam check (W 275° @12s → 4–6 ft).
    swellWindow: [[150,0],[160,.4],[175,.9],[185,1],[210,1],[225,.85],[255,.75],[270,.7],[285,.45],[295,.15],[305,0]],
    shadows: [{ dir: [225, 255], cut: 0.4 }],   // Catalina (~222–256°): short-period swell loses ~40%
    calib: 1.05,
    criteria: {
      dir:    { combo: [[175,215],[255,285]],    // S + W combo is the classic
                perfect: [[175,205]], good: [[165,215],[255,285]], mid: [[160,290]] },
      period: { perfect: [13,18], good: [11,20], mid: [9,22] },
      height: { perfect: [4,6],   good: [3,7],   mid: [2,8] },        // face ft; >8 = closeouts
      tide:   { perfect: [2,4],   good: [1,4.5], mid: [0,5.5], prefer: "rising" },
      wind:   { offshore: { perfect: 10, good: 15, mid: 20 }, onshore: { good: 6, mid: 12 } },
    },
    rainSensitive: true,
    tideStation: "9410580",   // Newport Bay Entrance, Corona del Mar
    buoy: "213", buoyName: "San Pedro South",      // CDIP station (= NDBC 46253)
    mop: "OC450", mopCalib: 1.15,   // CDIP nearshore point off 54th; +15% for jetty focusing (2026-11-11 cam check: 4–6 ft)
    notes: "Jetty-assisted beach break. Fast lefts off the north side of the groins on S swells, better rights on W swells. Minus tides go sand-sucking and closey; 5 ft+ highs get fat with backwash. Jetties hold up in light onshore better than the open beach.",
    other: ["Short-period swell from 225–255° is shadowed by Catalina", "Very long-period S (17–20 s) can close out much of Newport", "Crowded, can be aggressive", "Poor water quality after rain"],
  },
  {
    id: "malibu", name: "Malibu (1st / 2nd / 3rd Point)", short: "Malibu",
    lat: 34.0353, lon: -118.6785,
    facing: 190,              // S-facing right point; offshore = N/NE (NW is side-offshore)
    swellWindow: [[145,0],[160,.5],[180,.9],[190,1],[225,1],[240,.8],[255,.55],[270,.35],[285,.15],[300,0]],
    shadows: [{ dir: [240, 300], cut: 0.4 }],   // short-period W wraps poorly around Pt Dume
    calib: 0.75,
    criteria: {
      dir:    { perfect: [[185,225]], good: [[175,240]], mid: [[160,270]] },  // NW >285° mostly blocked
      period: { perfect: [15,22], good: [13,22], mid: [10,22] },             // points connect on 15 s+
      height: { perfect: [4,8],   good: [3,8],   mid: [1.5,10] },
      tide:   { perfect: [1.5,4], good: [1,4.5], mid: [0,5.5], prefer: "falling" },
      wind:   { offshore: { perfect: 8, good: 12, mid: 18 }, onshore: { good: 5, mid: 10 } },
    },
    sections: [
      { name: "1st Pt", minFt: 1.5 },                               // works all tides
      { name: "2nd Pt", minFt: 3, minTide: 1.0 },                   // unmakeable on low tide
      { name: "3rd Pt", minFt: 3.5, dir: [175, 240] },
      { name: "Connecting", minFt: 6, minPeriod: 15, dir: [180, 230] },
    ],
    rainSensitive: true,      // lagoon outflow
    crowd: "high",            // weekend crowds are a real factor here
    tideStation: "9410840",   // Santa Monica
    buoy: "103", buoyName: "Topanga Nearshore",    // CDIP station (= NDBC 46268)
    mop: "L0905", mopCalib: 0.9,    // CDIP nearshore point off the points; −10%: 1st Pt sits inside (2026-11-11: ~2–3 ft)
    notes: "Cobblestone right point. 1st Pt is the soft, consistent longboard wall; 2nd is short and hollow; 3rd is the fastest outside section. High tide (5 ft+) fills in and fats out.",
    other: ["2nd Pt unmakeable on low tide", "Points connect at ~6 ft+ on 15 s+ S/SSW", "Lagoon sand can create a closeout section mid-point", "Ultra crowded", "Stay out ~72 h after rain (lagoon outflow)"],
  },
  {
    id: "elporto", name: "El Porto, Manhattan Beach", short: "El Porto",
    lat: 33.8990, lon: -118.4195,
    facing: 250,              // WSW-facing; offshore = E/ENE
    swellWindow: [[190,0],[200,.35],[215,.55],[235,.75],[250,.9],[265,1],[295,1],[305,.7],[315,.3],[325,0]],
    calib: 1.1,               // 2026-11-11: was reading 3–4 ft vs 4–6 ft on Surfline's cam
    criteria: {
      // Perfect ONLY on a W/WNW + SSW/SW combo — a single direction walls up.
      dir:    { combo: [[265,295],[200,225]], perfect: [], good: [[215,305]], mid: [[200,310]] },
      period: { perfect: [13,17], good: [11,18], mid: [9,20] },
      height: { perfect: [5,8],   good: [4,8],   mid: [3,10] },
      tide:   { perfect: [1.5,3.5], good: [1,4.5], mid: [0,5.5], prefer: "rising" },
      // "Even a light onshore ruins it" → strict onshore limits; very strong offshore is hard to paddle into.
      wind:   { offshore: { perfect: 10, good: 12, mid: 20 }, onshore: { good: 4, mid: 9 } },
    },
    comboNeeded: true,        // no combo + >6 ft → size capped at Mid ("Great Wall of El Porto")
    rainSensitive: true,
    tideStation: "9410840",   // Santa Monica
    buoy: "028", buoyName: "Santa Monica Bay",     // CDIP station (= NDBC 46221)
    mop: "L0575", mopCalib: 1.0,    // CDIP nearshore point off El Porto (2026-11-11 cam check: 4–6 ft, matched as-is)
    notes: "Open sandbar beach break and the South Bay's swell magnet — usually 1–2 ft bigger than neighbours. Look for the 'holes' between closeouts. Sea breeze usually by late morning. Rippy on low tide.",
    other: ["Single-direction swell = closeouts; combos make the peaks", "Sandbars shift (beach nourishment has hurt it before)", "Busy when good, little localism", "Storm-drain runoff after rain"],
  },
];

const TZ = "America/Los_Angeles";
const DAYS = 3;

/* =====================================================================
   RATING MODEL
   ---------------------------------------------------------------------
   Each factor is placed in a tier using the spot's researched criteria:
     3 Perfect · 2 Good · 1 Mid / Fun · 0 Don't Go
   Tiers become points (PTS). The overall score is mostly the WORST
   factor (one bad factor ruins a session), plus a weighted average of
   all of them:
       score = 0.7 × min(points) + 0.3 × weighted mean(points)
   Weights put spot-specific factors (direction, wind, tide, period)
   above raw size — a big swell can't buy a good rating on its own.
   ===================================================================== */
const PTS     = [1.5, 5, 7.5, 10];                 // points per tier 0..3
const WEIGHTS = { dir: 1.2, period: 1.0, height: 0.7, tide: 1.0, wind: 1.3, water: 0.5 };
const MIN_SHARE = 0.7;                              // how much the worst factor dominates
const TIERS = [                                     // overall score → label
  { min: 0, name: "Don't Go",  cls: "t0" },
  { min: 4, name: "Mid / Fun", cls: "t1" },
  { min: 7, name: "Good",      cls: "t2" },
  { min: 9, name: "Perfect",   cls: "t3" },
];
const tierOf = score => [...TIERS].reverse().find(t => score >= t.min);
const LEVEL  = TIERS;                               // factor level i → same names/colors

/* ============================ small helpers ============================ */
const $ = s => document.querySelector(s);
const store = { get(k,d){ try{ return localStorage.getItem(k) ?? d; }catch{ return d; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch{} } };
const prefs = { h: store.get("surf.h","ft"), w: store.get("surf.w","kt"), spot: store.get("surf.spot", SPOTS[0].id) };
const M2FT = 3.28084;
const fmtH = m => m == null ? "–" : prefs.h === "ft" ? (m*M2FT).toFixed(1) : m.toFixed(1);
const hU = () => prefs.h;
const fmtW = kt => kt == null ? "–" : Math.round(prefs.w === "kt" ? kt : prefs.w === "mph" ? kt*1.15078 : kt*1.852);
const wU = () => prefs.w === "kmh" ? "km/h" : prefs.w;
const fmtRange = (loFt, hiFt) => {                  // surf range, input in feet
  const f = prefs.h === "ft" ? v => Math.max(0, Math.round(v)) : v => Math.max(0, Math.round(v/M2FT*10)/10);
  const a = f(loFt), b = f(hiFt); return a === b ? `${a}` : `${a}–${b}`;
};
const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const compass = d => d == null ? "–" : COMPASS[Math.round(((d%360)+360)%360/22.5)%16];
const angDiff = (a,b) => { const d = Math.abs(((a-b)%360+360)%360); return d > 180 ? 360-d : d; };
const inR   = (v, r) => !!r && v >= r[0] && v <= r[1];
const inAny = (v, rs) => (rs || []).some(r => inR(v, r));
const rangesTxt = (rs, u="") => rs && rs.length ? rs.map(r => `${r[0]}–${r[1]}${u}`).join(" or ") : "—";

/* Small arrow icon pointing the way the wind/swell is TRAVELLING (from + 180). */
const arrowIcon = (fromDeg, size=14) => fromDeg == null ? "" :
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="transform:rotate(${(fromDeg+180)%360}deg);flex:none" aria-hidden="true">
     <path d="M12 3 L19 19 L12 15 L5 19 Z" fill="currentColor"/></svg>`;

/* Times: everything is keyed by local-LA "YYYY-MM-DDTHH" strings so the page
   is correct no matter what timezone the phone is in. */
function laNowKey(){
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour === "24" ? "00" : p.hour}`;
}
const keyOf = s => s.slice(0,13).replace(" ","T");
const addH  = (k, n=1) => new Date(Date.UTC(+k.slice(0,4), +k.slice(5,7)-1, +k.slice(8,10), +k.slice(11,13)+n)).toISOString().slice(0,13);
const hourLabel = k => { const h = +k.slice(11,13); return h===0?"12a":h<12?`${h}a`:h===12?"12p":`${h-12}p`; };
const clock = s => { const h = +s.slice(11,13), m = s.slice(14,16); return `${h%12||12}:${m}${h<12?"a":"p"}`; };
const dayLabel = (k, opts={weekday:"short",month:"short",day:"numeric"}) => new Date(k.slice(0,10)+"T12:00").toLocaleDateString("en-US",opts);

async function getJSON(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error(`${r.status} from ${new URL(url).host}`);
  return r.json();
}

/* ============================ data loading ============================ */
const cache = {};
async function loadSpot(spot){
  const marineVars = ["wave_height","wave_period",
    "swell_wave_height","swell_wave_direction","swell_wave_period",
    "secondary_swell_wave_height","secondary_swell_wave_direction","secondary_swell_wave_period",
    "wind_wave_height","wind_wave_direction","wind_wave_period","sea_surface_temperature"].join(",");
  const tz = encodeURIComponent(TZ);
  const marineURL = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&hourly=${marineVars}&timezone=${tz}&forecast_days=${DAYS+1}&cell_selection=sea`;
  // past_days=3 gives the last 72 h of rain for the water-quality factor
  const wxURL = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&daily=sunrise,sunset,precipitation_sum&precipitation_unit=inch&past_days=3&wind_speed_unit=kn&temperature_unit=fahrenheit&timezone=${tz}&forecast_days=${DAYS+1}`;
  // HRRR: NOAA's 3 km model — much better at morning offshores and the afternoon
  // sea breeze. Covers ~48 h; the wind above fills in after that.
  const hrrrURL = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&models=gfs_hrrr&wind_speed_unit=kn&timezone=${tz}&forecast_days=${DAYS}`;
  const today = laNowKey().slice(0,10).replace(/-/g,"");
  const tideBase = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&datum=MLLW&station=${spot.tideStation}&time_zone=lst_ldt&units=english&format=json&application=surf_dashboard&begin_date=${today}&range=${(DAYS+1)*24}`;
  const [marine, wx, tideH, tideHL, buoy, mop, mopNow, hrrr] = await Promise.all([
    getJSON(marineURL), getJSON(wxURL),
    getJSON(tideBase+"&interval=h").catch(e=>({error:e.message})),
    getJSON(tideBase+"&interval=hilo").catch(e=>({error:e.message})),
    loadBuoy(spot.buoy, spot.buoyName),
    loadMop(spot.mop),
    loadMopNow(spot.mop),
    getJSON(hrrrURL).catch(() => null),
  ]);
  return { marine, wx, tideH, tideHL, buoy, mop, mopNow, hrrr };
}

/* Observed buoy, from CDIP (Scripps) — the same buoys NDBC republishes, but CDIP's
   THREDDS server allows browser requests (NDBC's site does not). Two tiny requests:
   1) the .dds file for the array lengths, 2) just the last value of each variable. */
async function loadBuoy(id, name){
  if(!id) return null;
  const base = `https://thredds.cdip.ucsd.edu/thredds/dodsC/cdip/realtime/${id}p1_rt.nc`;
  try {
    const dds = await (await fetch(base + ".dds", { signal: AbortSignal.timeout(8000) })).text();
    const nW = +((dds.match(/waveTime\[waveTime = (\d+)\]/) || [])[1] || 0);
    const nS = +((dds.match(/sstTime\[sstTime = (\d+)\]/) || [])[1] || 0);
    if(!nW) throw new Error("no wave data");
    const vars = ["waveTime","waveHs","waveTp","waveTa","waveDp"].map(v => `${v}[${nW-1}]`)
      .concat(nS ? ["sstTime","sstSeaSurfaceTemperature"].map(v => `${v}[${nS-1}]`) : []);
    const txt = await (await fetch(`${base}.ascii?${vars.map(encodeURIComponent).join(",")}`, { signal: AbortSignal.timeout(8000) })).text();
    const val = k => { const m = txt.match(new RegExp(`${k}\\[1\\]\\s+(-?[\\d.eE+]+)`)); const v = m ? +m[1] : null; return v == null || v < -900 ? null : v; };
    const hs = val("waveHs");
    if(hs == null) throw new Error("no recent wave data");
    return { id, name, time: new Date(val("waveTime")*1000), hs, tp: val("waveTp"), ta: val("waveTa"), dp: val("waveDp"), wtmp: val("sstSeaSurfaceTemperature") };
  } catch(e){
    return { id, name, error: "buoy data didn't load just now" };
  }
}

/* =====================================================================
   CDIP NEARSHORE MODEL (MOP) — Scripps' wave model run to points every
   ~100 m along the SoCal coast at 10 m depth. It already accounts for
   Channel Islands shadowing and seafloor refraction, so it's a much better
   starting point for surf size than the offshore model.
   Find a point: cdip.ucsd.edu → MOP, or ask Claude for the nearest label.
   One request per spot: 3-hourly Hs / Tp / Dp for ~10 days.
   ===================================================================== */
async function loadMop(site){
  if(!site) return null;
  try {
    const url = `https://thredds.cdip.ucsd.edu/thredds/dodsC/cdip/model/MOP_alongshore/${site}_forecast.nc.ascii?waveTime,waveHs,waveTp,waveDp`;
    const txt = await (await fetch(url, { signal: AbortSignal.timeout(10000) })).text();
    const arr = k => { const m = txt.match(new RegExp(`\\n${k}\\[\\d+\\]\\n([^\\n]+)`)); return m ? m[1].split(",").map(Number) : null; };
    const t = arr("waveTime"), hs = arr("waveHs"), tp = arr("waveTp"), dp = arr("waveDp");
    if(!t || !hs || !tp || t.length !== hs.length) return null;
    return { site, t, hs, tp, dp };
  } catch { return null; }
}
/* LA-local hour key "YYYY-MM-DDTHH" → epoch seconds (offset from the marine API) */
const keyEpoch = (k, offsetSec) => Date.UTC(+k.slice(0,4), +k.slice(5,7)-1, +k.slice(8,10), +k.slice(11,13))/1000 - (offsetSec ?? -28800);
/* Linear interpolation of the 3-hourly MOP series to one moment. */
function mopAt(mop, ts){
  if(!mop || !mop.t?.length || ts < mop.t[0] || ts > mop.t[mop.t.length-1]) return null;
  let j = mop.t.findIndex(x => x >= ts); if(j <= 0) j = 1;
  const f = (ts - mop.t[j-1]) / (mop.t[j] - mop.t[j-1]);
  const lerp = a => a[j-1] + (a[j]-a[j-1])*f;
  const hs = lerp(mop.hs), tp = f < .5 ? mop.tp[j-1] : mop.tp[j];   // period: nearest, not blended
  return hs > 0 && tp > 0 ? { hs, tp, dp: f < .5 ? mop.dp?.[j-1] : mop.dp?.[j] } : null;
}
/* =====================================================================
   LIVE BUOY CORRECTION — CDIP's MOP "nowcast" is the same nearshore model
   driven by the live CDIP buoys, updated hourly (~2 h behind). Comparing it
   with the forecast for the same hours shows whether the forecast is running
   high or low today. That ratio is applied to the forecast at full strength
   for CORR.fullH hours past the last nowcast, then fades to nothing by CORR.fadeH.
   ===================================================================== */
const CORR = { fullH: 6, fadeH: 30, min: 0.6, max: 1.8 };
async function loadMopNow(site){
  if(!site) return null;
  try {
    const base = `https://thredds.cdip.ucsd.edu/thredds/dodsC/cdip/model/MOP_alongshore/${site}_nowcast.nc`;
    const dds = await (await fetch(base + ".dds", { signal: AbortSignal.timeout(10000) })).text();
    const n = +((dds.match(/waveTime\[waveTime = (\d+)\]/) || [])[1] || 0);
    if(n < 3) return null;
    const sl = `%5B${n-3}:1:${n-1}%5D`;
    const txt = await (await fetch(`${base}.ascii?waveTime${sl},waveHs${sl}`, { signal: AbortSignal.timeout(10000) })).text();
    const arr = k => { const m = txt.match(new RegExp(`\\n${k}\\[\\d+\\]\\n([^\\n]+)`)); return m ? m[1].split(",").map(Number) : null; };
    const t = arr("waveTime"), hs = arr("waveHs");
    return t && hs && t.length === hs.length ? { t, hs } : null;
  } catch { return null; }
}
/* ratio nowcast ÷ forecast over the last 3 nowcast hours → { r, t0 } */
function mopCorrection(mop, now){
  if(!mop || !now) return null;
  const rs = now.t.map((ts,i) => { const f = mopAt(mop, ts); return f && f.hs > 0.05 && now.hs[i] > 0 ? now.hs[i]/f.hs : null; }).filter(Boolean);
  if(!rs.length) return null;
  const r = Math.min(CORR.max, Math.max(CORR.min, rs.reduce((a,b)=>a+b,0)/rs.length));
  return { r, t0: now.t[now.t.length-1] };
}
/* forecast MOP value at ts, with the buoy correction blended in */
function mopCorrectedAt(mop, corr, ts){
  const f = mopAt(mop, ts); if(!f) return null;
  if(!corr) return f;
  const hrs = (ts - corr.t0)/3600;
  const wgt = hrs <= CORR.fullH ? 1 : hrs >= CORR.fadeH ? 0 : 1 - (hrs - CORR.fullH)/(CORR.fadeH - CORR.fullH);
  const k = 1 + (corr.r - 1)*wgt;
  return { ...f, hs: f.hs*k, corr: k };
}

/* MOP Hs at 10 m depth → typical set face height (ft):
   1) un-shoal to deep-water height with linear wave theory,
   2) breaking height with Komar & Gaughan,
   3) × SET_FACTOR (sets vs. average). 1.0 since the buoy correction went in:
      2026-11-11 the buoy-corrected nearshore height matched Surfline's cams
      (54th 4.3 ft vs 4–6, Malibu 2.7 vs 2–3, El Porto 5.2 vs 4–6) without a boost. */
const SET_FACTOR = 1.0;
function mopFaceFt(hs10, tp, depth = 10){
  const w = 2*Math.PI/tp; let k = w*w/9.81;
  for(let n=0;n<50;n++) k = w*w/(9.81*Math.tanh(k*depth));            // dispersion relation
  const cg = 0.5*(1 + 2*k*depth/Math.sinh(2*k*depth)) * (w/k), cg0 = 9.81*tp/(4*Math.PI);
  const H0 = hs10 / Math.sqrt(cg0/cg);                                  // shoaling coefficient
  return breaker(H0, tp) * M2FT * SET_FACTOR;
}

/* ============================ surf height estimate ============================
   1. Each swell train is scaled by the spot's exposure to its direction.
   2. Breaking height per train, Komar & Gaughan (1972):
        Hb = 0.39 · g^0.2 · (T · H0²)^0.4      (metres, seconds)
      Longer period → bigger surf from the same offshore height.
   3. Trains combined by energy (root-sum-square) × spot calib.
   ============================================================================ */
function exposure(spot, dir){
  if(dir == null) return 0;
  const w = spot.swellWindow;
  for(let i=0;i<w.length-1;i++){
    const [d0,f0] = w[i], [d1,f1] = w[i+1];
    if(dir >= d0 && dir <= d1) return f0 + (f1-f0)*(dir-d0)/(d1-d0);
  }
  return 0;
}
const breaker = (H, T) => (H>0 && T>0) ? 0.39 * Math.pow(9.81,0.2) * Math.pow(T*H*H, 0.4) : 0;

/* ============================ rate one hour ============================ */
function analyseHour(spot, m, i, wind, tide, trend, rain72, mop){
  const C = spot.criteria;

  // ---- swell trains → estimated face height ----
  const trains = [
    { kind:"Primary",    H:m.swell_wave_height[i],             T:m.swell_wave_period[i],             D:m.swell_wave_direction[i] },
    { kind:"Secondary",  H:m.secondary_swell_wave_height?.[i], T:m.secondary_swell_wave_period?.[i], D:m.secondary_swell_wave_direction?.[i] },
    { kind:"Wind waves", H:m.wind_wave_height[i],              T:m.wind_wave_period[i],              D:m.wind_wave_direction[i] },
  ].filter(t => t.H != null && t.H > 0.05 && t.T);
  let e2 = 0, swellE = 0, tW = 0;
  for(const t of trains){
    t.exp = exposure(spot, t.D);
    for(const sh of spot.shadows || [])
      if(inR(t.D, sh.dir)) t.exp *= 1 - sh.cut * Math.min(1, Math.max(0, (15 - t.T)/5));
    t.hb = breaker(t.H * t.exp, t.T);
    e2 += t.hb*t.hb; tW += t.hb*t.hb*t.T;
    if(t.kind !== "Wind waves") swellE += t.hb*t.hb;
  }
  // Surf height: CDIP nearshore model when available (already includes island
  // shadowing and seafloor), otherwise our own estimate from the offshore model.
  let hbFt, sizeSource;
  if(mop){ hbFt = mopFaceFt(mop.hs, mop.tp) * (spot.mopCalib ?? 1); sizeSource = "CDIP nearshore"; }
  else   { hbFt = Math.sqrt(e2) * M2FT * (spot.calib ?? 1);        sizeSource = "offshore estimate"; }
  const surfLo = hbFt*0.8, surfHi = hbFt*1.1, surfMid = hbFt*0.95;
  const domT = e2 ? tW/e2 : 0;                      // energy-weighted period at the break
  const cleanRatio = e2 ? swellE/e2 : 0;            // groundswell share vs local wind waves
  const ranked = trains.slice().sort((a,b)=>b.hb-a.hb);
  const top = ranked[0], second = ranked[1];
  // combo = a second train with ≥40% of the top train's breaking height, ≥30° apart
  const combo = !!(second && second.hb >= 0.4*top.hb && angDiff(top.D, second.D) >= 30);

  const F = [];   // factors: { key, name, value, level, need, note }
  const add = (key, name, value, level, need, note) => F.push({ key, name, value, level, need, note });

  // ---- 1. Swell direction (dominant train; combos can earn Perfect) ----
  {
    const c = C.dir; let lv = 0, note = "";
    if(top){
      lv = inAny(top.D, c.perfect) ? 3 : inAny(top.D, c.good) ? 2 : inAny(top.D, c.mid) ? 1 : 0;
      if(c.combo && combo){
        const w1 = c.combo.findIndex(r => inR(top.D, r)), w2 = c.combo.findIndex(r => inR(second.D, r));
        if(w1 >= 0 && w2 >= 0 && w1 !== w2){ lv = 3; note = "combo swell"; }
      }
    }
    const need = lv === 3 ? "" : lv === 2 ? `Perfect: ${rangesTxt(c.perfect,"°")}${c.combo ? ` or a ${rangesTxt([c.combo[0]],"°")} + ${rangesTxt([c.combo[1]],"°")} combo` : ""}`
               : lv === 1 ? `Good: ${rangesTxt(c.good,"°")}` : `Mid: ${rangesTxt(c.mid,"°")}`;
    add("dir", "Swell dir", top ? `${compass(top.D)} ${Math.round(top.D)}°${combo ? ` + ${compass(second.D)}` : ""}` : "–", lv, need, note);
  }
  // ---- 2. Period (energy-weighted, at the break) ----
  {
    const c = C.period; let lv = inR(domT,c.perfect)?3 : inR(domT,c.good)?2 : inR(domT,c.mid)?1 : 0, note = "";
    if(cleanRatio < 0.5 && lv > 1){ lv = 1; note = "mostly local wind waves"; }
    const need = lv === 3 ? "" : `${LEVEL[lv+1].name}: ${rangesTxt([[c.perfect,c.good,c.mid][3-(lv+1)]]," s")}`;
    add("period", "Period", `${domT.toFixed(0)} s`, lv, need, note);
  }
  // ---- 3. Size (estimated face height) ----
  {
    const c = C.height; let lv = inR(surfMid,c.perfect)?3 : inR(surfMid,c.good)?2 : inR(surfMid,c.mid)?1 : 0, note = "";
    if(surfMid > c.mid[1]) note = "too big / closing out";
    else if(surfMid < c.mid[0]) note = "too small";
    if(spot.comboNeeded && !combo && surfMid > 6 && lv > 1){ lv = 1; note = "single-direction swell walls up"; }
    const need = lv === 3 ? "" : `${LEVEL[lv+1].name}: ${rangesTxt([[c.perfect,c.good,c.mid][3-(lv+1)]]," ft")}`;
    add("height", "Size", `${fmtRange(surfLo, surfHi)} ${hU()}`, lv, need, note);
  }
  // ---- 4. Tide (ft MLLW + preferred direction) ----
  if(tide != null){
    const c = C.tide; let lv = inR(tide,c.perfect)?3 : inR(tide,c.good)?2 : inR(tide,c.mid)?1 : 0, note = "";
    const wrongWay = (c.prefer === "rising" && trend === "↓") || (c.prefer === "falling" && trend === "↑");
    if(lv === 3 && wrongWay){ lv = 2; note = `prefers ${c.prefer}`; }
    if(lv < 3) note = note || (tide > c.perfect[1] ? "too high" : "too low");
    const need = lv === 3 ? "" : lv === 2 ? `Perfect: ${rangesTxt([c.perfect]," ft")}${c.prefer ? `, ${c.prefer}` : ""}` : `${LEVEL[lv+1].name}: ${rangesTxt([[c.perfect,c.good,c.mid][3-(lv+1)]]," ft")}`;
    add("tide", "Tide", `${tide.toFixed(1)} ft ${trend}`, lv, need, note);
  }
  // ---- 5. Wind relative to the beach ----
  let windCls = "w-cross", windTag = "–";
  if(wind.spd != null && wind.dir != null){
    const c = C.wind, k = wind.spd;
    const rel = angDiff(wind.dir, (spot.facing+180)%360);     // 0° = dead offshore
    const offside = rel <= 80;                                // offshore or cross-offshore
    windTag = k < 4 ? "Glassy" : rel <= 45 ? "Offshore" : rel <= 80 ? "Cross-off" : rel <= 110 ? "Cross-shore" : rel <= 135 ? "Cross-on" : "Onshore";
    windCls = k < 4 || offside ? "w-off" : rel <= 110 ? "w-cross" : "w-on";
    let lv, need;
    if(k < 4){ lv = 3; need = ""; }
    else if(offside){
      lv = k <= c.offshore.perfect ? 3 : k <= c.offshore.good ? 2 : k <= c.offshore.mid ? 1 : 0;
      need = lv === 3 ? "" : `${LEVEL[lv+1].name}: offshore ≤${[c.offshore.perfect,c.offshore.good,c.offshore.mid][3-(lv+1)]} kt`;
    } else {
      lv = k <= c.onshore.good ? 2 : k <= c.onshore.mid ? 1 : 0;
      need = lv === 2 ? "Perfect: offshore or glassy (<4 kt)" : `${LEVEL[lv+1].name}: onshore ≤${lv === 1 ? c.onshore.good : c.onshore.mid} kt`;
    }
    add("wind", "Wind", `${fmtW(k)} ${wU()} ${compass(wind.dir)}`, lv, need, windTag.toLowerCase());
  }
  // ---- 6. Water quality (rain in the last 72 h) ----
  if(spot.rainSensitive && rain72 != null){
    const lv = rain72 >= 0.25 ? 0 : rain72 >= 0.1 ? 1 : 3;
    add("water", "Water", rain72 >= 0.01 ? `${rain72.toFixed(2)}" rain / 72 h` : "No recent rain", lv, lv === 3 ? "" : "Wait ~72 h after rain", lv < 3 ? "runoff risk" : "");
  }

  // ---- combine ----
  const pts = F.map(f => PTS[f.level]);
  const minP = Math.min(...pts);
  const wSum = F.reduce((s,f)=>s+WEIGHTS[f.key],0);
  const mean = F.reduce((s,f)=>s+WEIGHTS[f.key]*PTS[f.level],0) / wSum;
  const score = MIN_SHARE*minP + (1-MIN_SHARE)*mean;
  const minLv = Math.min(...F.map(f=>f.level));
  const limiters = F.filter(f => f.level === minLv && minLv < 3).sort((a,b)=>WEIGHTS[b.key]-WEIGHTS[a.key]);
  // what a swell-size-only rating would say (size + period, nothing else)
  const fz = k => F.find(f=>f.key===k);
  const swellOnly = (PTS[fz("height").level] + PTS[fz("period").level]) / 2;

  const sections = (spot.sections||[]).map(sec => ({
    name: sec.name,
    on: surfMid >= sec.minFt
      && (!sec.dir || (top && inR(top.D, sec.dir)))
      && (sec.minTide == null || (tide != null && tide >= sec.minTide))
      && (sec.minPeriod == null || domT >= sec.minPeriod),
  }));

  return { sizeSource, sizeCorr: mop?.corr ?? null, trains, surfLo, surfHi, surfMid, domT, combo, factors: F, score, tier: tierOf(score), limiters, swellOnly, sections, windCls, windTag };
}

/* ============================ build the 72-h model ============================ */
function build(spot, raw){
  const m = raw.marine.hourly, w = raw.wx.hourly;
  const wIdx = {}; w.time.forEach((t,i)=>wIdx[keyOf(t)]=i);
  const tide = {}; (raw.tideH.predictions||[]).forEach(p=>tide[keyOf(p.t)] = +p.v);
  const sun = {}; raw.wx.daily.time.forEach((d,i)=>sun[d] = [keyOf(raw.wx.daily.sunrise[i]), keyOf(raw.wx.daily.sunset[i])]);
  const now = laNowKey(), today = now.slice(0,10);
  const rain72 = raw.wx.daily.time.reduce((s,day,i) => day <= today ? s + (raw.wx.daily.precipitation_sum?.[i] || 0) : s, 0);
  const hr = raw.hrrr?.hourly, hIdx = {}; hr?.time.forEach((t,i)=>hIdx[keyOf(t)]=i);
  const corr = mopCorrection(raw.mop, raw.mopNow);

  const hours = [];
  m.time.forEach((t,i)=>{
    const k = keyOf(t);
    if(k < now || hours.length >= DAYS*24) return;
    const j = wIdx[k];
    const hi = hIdx[k], useH = hi != null && hr.wind_speed_10m[hi] != null && hr.wind_direction_10m[hi] != null;
    const wind = useH
      ? { spd: hr.wind_speed_10m[hi], dir: hr.wind_direction_10m[hi], gust: hr.wind_gusts_10m?.[hi] ?? w.wind_gusts_10m?.[j], model: "HRRR" }
      : { spd: w.wind_speed_10m?.[j], dir: w.wind_direction_10m?.[j], gust: w.wind_gusts_10m?.[j], model: "GFS blend" };
    const td = tide[k] ?? null, nx = tide[addH(k)];
    const trend = (td!=null && nx!=null) ? (nx>td+.05?"↑":nx<td-.05?"↓":"→") : "";
    const sr = sun[k.slice(0,10)];
    const daylight = sr ? (k >= sr[0] && k <= sr[1]) : true;
    hours.push({ k, i, wind, tide: td, trend, air: w.temperature_2m?.[j], sst: m.sea_surface_temperature?.[i],
      daylight, raw: m, crowd: crowdAt(spot, k, daylight),
      a: analyseHour(spot, m, i, wind, td, trend, rain72, mopCorrectedAt(raw.mop, corr, keyEpoch(k, raw.marine.utc_offset_seconds))) });
  });
  // best 2-hour daylight window per day
  const best = {};
  for(let n=0;n<hours.length-1;n++){
    const h=hours[n], h2=hours[n+1];
    if(!h.daylight || !h2.daylight) continue;
    const s = (h.a.score + h2.a.score)/2, d = h.k.slice(0,10);
    if(!best[d] || s > best[d].s) best[d] = { s, k:h.k, k2:h2.k, h };
  }
  // dawn patrol: the first two daylight hours of each day
  const dawn = {};
  for(const h of hours){
    const d = h.k.slice(0,10), sr = sun[d];
    if(!h.daylight || (sr && h.k > addH(sr[0], 1))) continue;   // only the sunrise hour and the one after
    if(!dawn[d]) dawn[d] = [];
    if(dawn[d].length < 2) dawn[d].push(h);
  }
  for(const d in dawn){ const hs = dawn[d]; dawn[d] = { s: hs.reduce((x,h)=>x+h.a.score,0)/hs.length, k: hs[0].k, h: hs[0] }; }
  return { rain72, corr, hours, best, dawn, sun, hilo: raw.tideHL.predictions||[], tideAll: raw.tideH.predictions||[], tideErr: raw.tideH.error, buoy: raw.buoy };
}


/* =====================================================================
   CROWD FLAG — weekends and US holidays, 7 AM–3 PM, are busier. Shown as a
   flag only (it doesn't change the rating). spot.crowd: "high" | "medium".
   ===================================================================== */
function usHolidays(y){
  const nth = (m, wd, n) => { const d = new Date(Date.UTC(y, m, 1)); const off = (wd - d.getUTCDay() + 7) % 7; return new Date(Date.UTC(y, m, 1 + off + 7*(n-1))); };
  const last = (m, wd) => { const d = new Date(Date.UTC(y, m+1, 0)); const off = (d.getUTCDay() - wd + 7) % 7; return new Date(Date.UTC(y, m, d.getUTCDate() - off)); };
  const thx = nth(10, 4, 4);
  return new Set([new Date(Date.UTC(y,0,1)), nth(0,1,3), nth(1,1,3), last(4,1), new Date(Date.UTC(y,5,19)), new Date(Date.UTC(y,6,4)),
    nth(8,1,1), thx, new Date(thx.getTime() + 864e5), new Date(Date.UTC(y,11,25))].map(d => d.toISOString().slice(0,10)));
}
const _hol = {};
function crowdAt(spot, k, daylight){
  const day = k.slice(0,10), y = +k.slice(0,4), hr = +k.slice(11,13);
  const wd = new Date(day + "T12:00Z").getUTCDay();
  const hol = (_hol[y] ||= usHolidays(y)).has(day);
  if(!daylight || hr < 7 || hr > 15 || !(wd === 0 || wd === 6 || hol)) return null;
  return { level: spot.crowd || "medium", text: `${spot.crowd === "high" ? "Packed" : "Busy"} — ${hol ? "holiday" : "weekend"}` };
}

const limText = a => a.limiters.length ? a.limiters.map(f => `${f.name.toLowerCase()}${f.note ? ` (${f.note})` : ""}`).join(" & ") : "nothing — everything lines up";

/* Plain-language summary, e.g. "4–5 ft west swell at 12 s, light onshore wind, falling 2.6 ft tide." */
const DIR8 = ["north","northeast","east","southeast","south","southwest","west","northwest"];
const dirWord = d => DIR8[Math.round(((d%360)+360)%360/45)%8];
function summary(h){
  const a = h.a, top = a.trains.slice().sort((x,y)=>y.hb-x.hb)[0], parts = [];
  if(top) parts.push(`${fmtRange(a.surfLo,a.surfHi)} ${hU()} ${dirWord(top.D)} ${top.kind === "Wind waves" ? "wind swell" : "swell"} at ${Math.round(top.T)} s${a.combo ? " with a cross-swell" : ""}`);
  const k = h.wind.spd;
  if(k != null) parts.push(k < 4 ? "glassy" : `${k < 8 ? "light" : k < 13 ? "moderate" : k < 20 ? "fresh" : "strong"} ${a.windTag.toLowerCase()} wind`);
  if(h.tide != null) parts.push(`${h.trend === "↑" ? "rising" : h.trend === "↓" ? "falling" : "slack"} ${fmtH(h.tide/M2FT)} ${hU()} tide`);
  const s = parts.join(", ");
  return s ? s[0].toUpperCase() + s.slice(1) + "." : "";
}
