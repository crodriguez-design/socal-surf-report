/* =====================================================================
   Surf alerts — runs on GitHub's schedule (see .github/workflows/surf-alerts.yml).
   Loads the SAME rating engine as the app (model.js), looks at the next
   ALERT.hours hours of daylight for every spot, and when a spot reaches
   ALERT.minTier or better it opens ONE digest issue per run (assigned to the
   repo owner) listing every new Good+ window. GitHub then notifies you
   (GitHub app push and/or email). A spot/day is never repeated.

   Also runs the weekly accuracy check (alerts/accuracy.mjs) on the Monday
   morning run, and opens an issue only if the forecast has drifted.

   Run locally (prints instead of opening issues):  node alerts/check.mjs
   Force the accuracy check:                         FORCE_ACCURACY=1 node alerts/check.mjs
   ===================================================================== */
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { runAccuracyCheck } from "./accuracy.mjs";

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
        found.push({ spot, day, run: [...run], peak, fconf: d.fconf?.[day] });
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
      f.fconf ? `- Forecast confidence: **${{ high: "solid", medium: "fair", low: "shaky" }[f.fconf.level]}** (the two nearshore forecasts differ by about ±${f.fconf.spread}%)` : null,
      ``,
      `[Open the app](${ALERT.appURL}#/spot/${f.spot.id})`,
      ``,
      `<sub>alert-key: ${f.spot.id}-${f.day} · automatic, from the surf-alerts workflow. Close or ignore it; you won't get a repeat for this spot and day.</sub>`,
    ].filter(x => x !== null).join("\n"),
  };
});

/* ---- weekly accuracy check: Monday's morning run (13 UTC), or FORCE_ACCURACY=1 ---- */
const nowUTC = new Date();
let acc = null;
if (process.env.FORCE_ACCURACY || (nowUTC.getUTCDay() === 1 && nowUTC.getUTCHours() < 18)) {
  acc = await runAccuracyCheck();
  console.log("\nAccuracy check:\n" + acc.lines.map(l => "  " + l).join("\n") + (acc.ok ? "\n  → all within limits" : "\n  → DRIFT: " + acc.problems.join("; ")));
}

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
// every spot/day ever alerted (old one-per-spot issues and new digests both carry alert-key lines)
const seen = new Set(existing.flatMap(i => [...(i.body || "").matchAll(/alert-key: ([\w-]+)/g)].map(m => m[1])));
const fresh = items.filter(it => !seen.has(it.key));
if (!fresh.length) console.log("nothing new to alert");
else {
  // ONE notification per run: a digest of every new Good+ window, best first
  const order = fresh.map(it => ({ it, f: found.find(f => `${f.spot.id}-${f.day}` === it.key) })).sort((a, b) => b.f.peak.a.score - a.f.peak.a.score);
  const names = [...new Set(order.map(o => o.f.spot.short || o.f.spot.name))];
  const title = fresh.length === 1 ? order[0].it.title
    : `🌊 ${fresh.length} Good windows: ${names.slice(0, 4).join(", ")}${names.length > 4 ? ` +${names.length - 4} more` : ""}`;
  const body = order.map(o => `### ${o.it.title.replace(/^🌊 /, "")}\n${o.it.body}`).join("\n\n---\n\n");
  await gh(`/issues`, { method: "POST", body: JSON.stringify({ title, body, labels: [ALERT.label], assignees: [owner] }) });
  console.log("alerted (digest):", title);
}

// accuracy drift → one issue per week (only when something is off)
if (acc && !acc.ok) {
  const wk = nowUTC.toISOString().slice(0, 10);
  const prior = await gh(`/issues?labels=accuracy-check&state=all&per_page=20`);
  if (!prior.some(i => (i.body || "").includes(`accuracy-key: ${wk}`))) {
    await gh(`/issues`, { method: "POST", body: JSON.stringify({
      title: `⚠️ Forecast accuracy drifted — ${wk}`,
      body: ["The weekly accuracy check found something off. Ask Claude to retune the app.", "", "**Problems:**", ...acc.problems.map(p => "- " + p), "", "**Full check:**", ...acc.lines.map(l => "- " + l), "", `<sub>accuracy-key: ${wk} · automatic, from alerts/accuracy.mjs</sub>`].join("\n"),
      labels: ["accuracy-check"], assignees: [owner] }) });
    console.log("opened accuracy-drift issue");
  }
}
