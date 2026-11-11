/* =====================================================================
   Surf alerts — runs on GitHub's schedule (see .github/workflows/surf-alerts.yml).
   Loads the SAME rating engine as the app (model.js), looks at the next
   ALERT.hours hours of daylight for every spot, and when a spot reaches
   ALERT.minTier or better it opens a GitHub issue assigned to the repo owner.
   GitHub then notifies you (GitHub app push and/or email, per your GitHub
   notification settings). One issue per spot per day — no repeats.

   Run locally (prints instead of opening issues):  node alerts/check.mjs
   ===================================================================== */
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const ALERT = {
  minTier: "Good",        // "Good" or "Perfect"
  hours: 48,              // how far ahead to look
  minWindow: 2,           // at least this many Good+ hours in a row
  appURL: "https://crodriguez-design.github.io/socal-surf-report/",
  label: "surf-alert",
};

/* ---- load model.js into a sandbox (it was written for the browser) ---- */
const code = await readFile(new URL("../model.js", import.meta.url), "utf8");
const ctx = vm.createContext({ fetch, AbortSignal, URL, Intl, console, setTimeout, clearTimeout, document: { querySelector: () => null } });
vm.runInContext(code + "\n;globalThis.__m = { SPOTS, TIERS, loadSpot, build, tierOf, fmtRange, hourLabel, dayLabel, summary, limText, addH };", ctx);
const M = ctx.__m;
const minScore = M.TIERS.find(t => t.name === ALERT.minTier).min;

/* ---- find Good+ windows ---- */
const found = [];
for (const spot of M.SPOTS) {
  let d;
  try { d = M.build(spot, await M.loadSpot(spot)); }
  catch (e) { console.log(`${spot.name}: couldn't load (${e.message})`); continue; }
  const hrs = d.hours.slice(0, ALERT.hours);
  let run = [];
  const flush = () => {
    if (run.length >= ALERT.minWindow) {
      const day = run[0].k.slice(0, 10);
      const peak = run.reduce((a, b) => (b.a.score > a.a.score ? b : a));
      const prev = found.find(f => f.spot.id === spot.id && f.day === day);
      if (!prev || peak.a.score > prev.peak.a.score) {
        if (prev) found.splice(found.indexOf(prev), 1);
        found.push({ spot, day, run: [...run], peak });
      }
    }
    run = [];
  };
  for (const h of hrs) { if (h.daylight && h.a.score >= minScore) run.push(h); else flush(); }
  flush();
  console.log(`${spot.name}: ${found.filter(f => f.spot.id === spot.id).length} window(s)`);
}

/* ---- report ---- */
const items = found.map(f => {
  const a = f.peak.a, t = M.tierOf(a.score);
  const when = `${M.dayLabel(f.day, { weekday: "short", month: "short", day: "numeric" })} ${M.hourLabel(f.run[0].k)}–${M.hourLabel(M.addH(f.run.at(-1).k))}`;
  return {
    key: `${f.spot.id}-${f.day}`,
    title: `🌊 ${t.name}: ${f.spot.short || f.spot.name} — ${when} (${M.fmtRange(a.surfLo, a.surfHi)} ft)`,
    body: [
      `**${f.spot.name}** looks **${t.name}** (${a.score.toFixed(1)}/10) ${when}.`,
      ``,
      `- ${M.summary(f.peak)}`,
      `- Wind: ${Math.round(f.peak.wind.spd)} kt from ${Math.round(f.peak.wind.dir)}° — ${a.windTag.toLowerCase()} (${f.peak.wind.model})`,
      `- Holding it back: ${a.limiters.length ? M.limText(a) : "nothing — everything lines up"}`,
      f.peak.crowd ? `- 👥 ${f.peak.crowd.text}` : null,
      ``,
      `[Open the app](${ALERT.appURL}#/spot/${f.spot.id})`,
      ``,
      `<sub>alert-key: ${f.spot.id}-${f.day} · automatic, from the surf-alerts workflow. Close or ignore it; you won't get a repeat for this spot and day.</sub>`,
    ].filter(x => x !== null).join("\n"),
  };
});

const token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPOSITORY;
if (!token || !repo) {
  console.log(items.length ? "\nWould alert:\n" + items.map(i => "• " + i.title).join("\n") : "\nNo Good+ windows in the next 48 h.");
  process.exit(0);
}

const gh = (path, opts = {}) => fetch(`https://api.github.com/repos/${repo}${path}`, {
  ...opts, headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
}).then(r => { if (!r.ok) throw new Error(`${r.status} ${path}`); return r.json(); });

const owner = repo.split("/")[0];
const existing = await gh(`/issues?labels=${ALERT.label}&state=all&per_page=100`);
const seen = new Set(existing.map(i => (i.body || "").match(/alert-key: ([\w-]+)/)?.[1]).filter(Boolean));
for (const it of items) {
  if (seen.has(it.key)) { console.log("already alerted:", it.key); continue; }
  await gh(`/issues`, { method: "POST", body: JSON.stringify({ title: it.title, body: it.body, labels: [ALERT.label], assignees: [owner] }) });
  console.log("alerted:", it.title);
}
