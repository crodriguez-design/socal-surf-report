# Spot research brief (shared by the research agents)

Goal: realistic, spot-specific criteria for a personal SoCal surf rating app. The app's whole point is to be MORE realistic than Surfline (which rates by swell size). Do NOT use Surfline's ratings/colors as truth; its public spot-guide text is fine as one source among several.

Use web search and read pages: Surfline spot-guide text (often 403 — fine to skip), surf-forecast.com break pages, wannasurf, surfnerd, magicseaweed archives, socalforecast.blogspot.com (Adam Wright break maps), mondo.surf, thesurfatlas, local blogs, forums, Reddit, Wikipedia, city/lifeguard pages. Do NOT log into anything.

For EACH spot return:

1. **Location**: lat/lon of the actual surf break at the shoreline (5 decimals), and how you got it (a geocode of a nearby street/landmark is fine — say which). Beach `facing` in degrees (the direction you look out to sea). Wave type (point / reef / beach break / jetty), left/right.
2. **Swell window**: ideal, workable and blocked directions (deg FROM). Account for Channel Islands, Point Conception, Point Dume, Palos Verdes, Catalina, San Clemente Island shadowing as relevant. Note if short-period swell from some arc is shadowed but long period wraps.
3. **Period**: min useful, ideal.
4. **Size** (face ft): flat / mid / good / perfect / too big (closeouts or maxing out).
5. **Tide** in ft MLLW (convert low/mid/high to numbers; SoCal range ≈ −1.5 to 7 ft, mid ≈ 2.5–3.5): best range, workable, bad; rising vs falling preference.
6. **Wind**: offshore direction; tolerance for onshore; typical daily pattern; Santa Ana behaviour.
7. **Other**: sandbar/seasonality, crowd, hazards, water quality after rain (rainSensitive yes/no), localism.

Then output a **machine-readable block** per spot, exactly in this shape (JavaScript object literal, numbers only, comments allowed):

```js
{
  id: "lowers", name: "Lower Trestles", short: "Lowers", region: "Orange County",
  lat: 33.38190, lon: -117.58860, facing: 225,
  // [direction FROM, exposure 0..1] points, sorted by direction; linear between, 0 outside.
  swellWindow: [[160,0],[175,.6],[190,1],[230,1],[255,.6],[275,.2],[290,0]],
  shadows: [{ dir: [lo, hi], cut: 0.4 }],          // optional: short-period cut for an island-shadowed arc
  criteria: {
    dir:    { perfect: [[a,b]], good: [[a,b]], mid: [[a,b]] },   // optional combo: [[a,b],[c,d]] = 2-swell combo counts as Perfect
    period: { perfect: [lo,hi], good: [lo,hi], mid: [lo,hi] },
    height: { perfect: [lo,hi], good: [lo,hi], mid: [lo,hi] },    // face ft; outside mid = Don't Go
    tide:   { perfect: [lo,hi], good: [lo,hi], mid: [lo,hi], prefer: "rising" | "falling" | null },
    wind:   { offshore: { perfect: kt, good: kt, mid: kt }, onshore: { good: kt, mid: kt } },  // max kt; onshore above mid = Don't Go
  },
  rainSensitive: true|false, crowd: "high"|"medium",
  notes: "2–3 sentences, plain language",
  other: ["short bullet", "..."],
}
```

Ranges must nest: perfect ⊆ good ⊆ mid (except where a tier has two separate ranges — then use the closest single range and mention it).
Mark every number you inferred rather than found with `// est.`.

Finish with a **sources list** (URLs) and a one-line note per spot on where sources disagreed. Keep the whole report under ~700 words of prose plus the code blocks.
