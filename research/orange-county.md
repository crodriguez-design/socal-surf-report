# Orange County spot research: HB Pier, Newport, Wedge

Swell-window arcs are my own bearings, worked out from coordinates. From HB, Catalina covers about 215–250°, San Clemente Island about 205–215°, and Palos Verdes blocks anything from about 285° on. From Newport, Catalina covers about 225–258°, San Clemente Island about 205–220°, and Palos Verdes blocks from about 280° on. Long-period groundswell (16 s or more) wraps around Catalina partly. There is an open W gap at about 255–280°. Tide numbers convert low, mid and high to MLLW feet: low is 0–1.5, mid is 2.5–3.5, high is 5 or more. Sources give wind in direction only, with no numbers.

## HB Pier: Northside and Southside
- **Location.** Coordinates are from Surfnerd's spot pins. North side: 33.65574, -118.00397. South side: 33.65475, -118.00291. The pier runs about 214°, so the beach faces about 214°. Both sides are sand-bottom pier breaks with lefts and rights. On the north side, the Pier Bowl is a short wedgy right into the pier on solid S swells, and a longer left runs up the beach. The south side has rights and lefts along the pilings.
- **Swell by side (checked against sources).** Sources lean toward the brief's premise but disagree. TheSurfAtlas and Yeeew say the **south side** is best in winter on **W–NW** swell that wraps under the pilings into peaky rights. They say the **north side** is best on summer **S–SW** swell. Another guide reverses this and says the north side handles big winter swell. Two of the three sources back the brief's version, so I used it, with a moderate weighting only. Both sides take swell from S through WNW. Surf-forecast.com gives WSW as the ideal direction for the pier as a whole.
- **Tide.** Low to mid on a rising tide. Waves lose punch at high tide and break on the sand.
- **Wind.** Offshore is NE. The north side gets a little shelter from SE wind and the south side a little from WNW wind. Both blow out around midday from S–W wind. Santa Anas groom it in fall.
- **Other.** The south side is often blackballed (closed to surfing) at midday in summer. Expect pilings, current and a heavy crowd at the pier. Avoid it after rain.

## Newport Lower Jetties (about 30th–40th St)
- **Location.** 33.61556, -117.93676 (Surfnerd pin, about 32nd St). Faces about 215°. A sand beach break between groins (short rock jetties), with lefts and rights.
- **Swell.** S and SW are the most reliable. Swell from SSE through WNW is workable. On big S swells that close out elsewhere, the jetties still give fun peaks and left walls.
- **Tide.** Works on any tide, with a rising tide preferred.
- **Wind.** Offshore is NE. Workable from NNW through N to ESE.
- **Other.** Medium crowd with a friendly lineup. Watch the rocks and the rips along the groins. Water quality is poor after rain.

## The Wedge
- **Location.** 33.59330, -117.88270. This is my estimate from a geocode of the West Jetty root at the end of the Balboa Peninsula; Wannasurf gives 33.59397, -117.88240. The beach faces about 185°. It is a jetty-reflection shorebreak. Wannasurf calls it a left: the backwash wedge off the jetty makes a short, heavy left with a peak that sometimes runs right.
- **Swell.** Sources say S to SSW, not SSE as the brief assumed: surf-forecast.com gives SSW, Wannasurf gives S, and Wikipedia gives S/SW. It needs groundswell of 15 s or more. Below about 12 s the reflection is sloppy and the peak doesn't form. W swell runs parallel to the jetty and does nothing.
- **Size.** It starts at 3–5 ft and holds 12 ft or more. Faces reach 20–30 ft.
- **Tide.** Mid on a rising tide.
- **Wind.** Light N offshore. Wannasurf says light NW–W is acceptable, since that wind runs along the jetty.
- **Hazards.** About 8 deaths and 35 paralysis cases (Wikipedia). It is closed to boards 10am–5pm from May 1 to Oct 31 (blackball), so it is bodysurf/bodyboard only in summer. There is localism and a crowd of spectators. **Perfect means perfect for experts only.**

## Newport Point
- **Location correction.** Several sources put Newport Point at **18th St, just SE of Newport Pier**, on the bend of the peninsula over the head of the Newport Submarine Canyon. That is about 3 km west of the Wedge, not right next to it. Coordinates: 33.60470, -117.92520 (my estimate from a geocode of 18th St and W Oceanfront). Faces about 205°. It is a sand-bottom beach break. Wannasurf says outright that it is "not really a point break". Adam Wright (socalforecast) says it is **mostly lefts**, surf-forecast.com says it peels left, and Wannasurf says rights and lefts. The brief's "sand-bottom right" is not supported.
- **Swell.** Short to medium period (10–12 s) **SE–S, about 160–180°**, typically from hurricanes. The canyon bends that swell back toward the Point. Generic forecast sites say SSW.
- **Tide.** Low (surf-forecast.com) to mid (Wannasurf).
- **Wind.** NE offshore, and light Santa Anas are best. Only a few days a year are good, and those get ultra crowded. It gets serious above about 8 ft. Expect rips, and water quality is poor after rain.

## Onshore strictness
No source gives a number for onshore wind. Every source names NE offshore and describes midday onshore wind blowing these spots out, which matches the user's El Porto rule. I set the onshore Don't Go limit at 5 kt (about 6 mph) for the HB, Jetties and Point beach breaks. The Wedge gets 6 kt, because light W–NW wind runs along the jetty. All of these limits are `// est.`

```js
{
  id: "hb-north", name: "Huntington Beach Pier, Northside", short: "HB North", region: "Orange County",
  lat: 33.65574, lon: -118.00397, facing: 214,
  swellWindow: [[150,0],[165,.6],[180,1],[210,1],[230,.7],[255,.8],[275,.6],[285,.2],[295,0]], // est. from geometry
  shadows: [{ dir: [215, 250], cut: 0.4 }], // Catalina; est.
  criteria: {
    dir:    { perfect: [[185,215]], good: [[175,240]], mid: [[160,285]] },     // S–SW favored; est. degrees
    period: { perfect: [14,18], good: [11,20], mid: [8,22] },                   // est.
    height: { perfect: [4,6], good: [3,7], mid: [2,9] },                        // sources: 4–8 ft working range
    tide:   { perfect: [1.5,3.5], good: [0.5,4.5], mid: [-0.5,5.5], prefer: "rising" }, // low–mid found; numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 20 }, onshore: { good: 3, mid: 5 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Pier Bowl right into the pier plus a longer left up the beach; best on S–SW summer swell at low-mid rising tide with NE or glassy wind. Always crowded and blows out by midday.",
  other: ["Pier pilings and current", "Heavy pier crowd", "Avoid 72 h after rain"],
}
```

```js
{
  id: "hb-south", name: "Huntington Beach Pier, Southside", short: "HB South", region: "Orange County",
  lat: 33.65475, lon: -118.00291, facing: 214,
  swellWindow: [[155,0],[170,.5],[190,.9],[210,1],[230,.7],[255,1],[280,.8],[288,.3],[295,0]], // est.
  shadows: [{ dir: [215, 250], cut: 0.4 }], // Catalina; est.
  criteria: {
    dir:    { perfect: [[250,280]], good: [[215,285]], mid: [[165,288]] },     // W–WNW winter favored; est.
    period: { perfect: [13,17], good: [10,19], mid: [8,22] },                   // est.
    height: { perfect: [4,6], good: [3,7], mid: [2,9] },                        // 4–8 ft range found; closeouts when big
    tide:   { perfect: [1.5,3.5], good: [0.5,4.5], mid: [-0.5,5.0], prefer: "rising" }, // loses punch at high; est. numbers
    wind:   { offshore: { perfect: 10, good: 15, mid: 20 }, onshore: { good: 3, mid: 5 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Peaky rights and lefts along the pilings; locals favor it in winter on W–NW swell wrapping under the pier. Low-mid rising tide, NE wind.",
  other: ["Often blackballed midday in summer", "Strong current on big swell", "Avoid after rain"],
}
```

```js
{
  id: "newport-lower", name: "Newport Lower Jetties", short: "Lower Jetties", region: "Orange County",
  lat: 33.61556, lon: -117.93676, facing: 215,
  swellWindow: [[150,0],[165,.7],[180,1],[215,1],[230,.6],[258,.7],[275,.5],[282,.1],[290,0]], // est.
  shadows: [{ dir: [225, 258], cut: 0.4 }, { dir: [205, 220], cut: 0.8 }], // Catalina, San Clemente Is.; est.
  criteria: {
    dir:    { perfect: [[180,210]], good: [[170,225]], mid: [[160,280]] },     // S–SW most reliable
    period: { perfect: [13,18], good: [11,20], mid: [8,22] },                   // est.
    height: { perfect: [4,7], good: [3,8], mid: [2,10] },                       // jetties hold big S; est.
    tide:   { perfect: [2,4], good: [1,5], mid: [-0.5,6], prefer: "rising" },   // all tides; numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 20 }, onshore: { good: 3, mid: 5 } }, // est.
  },
  rainSensitive: true, crowd: "medium",
  notes: "Sand peaks between rock groins, lefts and rights; S–SW groundswell, any tide (rising best), NE offshore. Holds shape on big S days that close out the open beach.",
  other: ["Rocks and rips along the groins", "Friendly-ish lineup"],
}
```

```js
{
  id: "wedge", name: "The Wedge", short: "The Wedge", region: "Orange County",
  lat: 33.59330, lon: -117.88270, facing: 185,                                  // est. geocode
  swellWindow: [[150,0],[165,.5],[180,1],[205,1],[220,.4],[235,0]],              // est.; W swell useless
  shadows: [{ dir: [205, 220], cut: 0.7 }],                                     // San Clemente Is.; est.
  criteria: {
    dir:    { perfect: [[180,205]], good: [[172,212]], mid: [[165,220]] },     // S–SSW per sources; est. degrees
    period: { perfect: [15,20], good: [14,21], mid: [12,22] },                  // <12 s sloppy (found)
    height: { perfect: [8,18], good: [6,20], mid: [4,25] },                     // starts 3–5 ft, holds 12+, 30 ft peaks; est. tiers
    tide:   { perfect: [2.5,4], good: [1.5,5], mid: [0.5,6], prefer: "rising" }, // mid rising found; numbers est.
    wind:   { offshore: { perfect: 8, good: 12, mid: 18 }, onshore: { good: 4, mid: 6 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Jetty backwash wedges S–SSW groundswell into a heavy shorebreak peak. 'Perfect' means perfect for experts only. It has caused deaths and spinal injuries.",
  other: ["Blackball 10am–5pm May 1–Oct 31 (bodysurf/bodyboard only)", "Extreme shorebreak; neck/spine injuries", "Localism, spectators"],
}
```

```js
{
  id: "newport-point", name: "Newport Point", short: "Newport Point", region: "Orange County",
  lat: 33.60470, lon: -117.92520, facing: 205,                                  // est. geocode 18th St
  swellWindow: [[145,0],[155,.6],[165,1],[185,1],[200,.6],[215,.3],[230,0]],    // est.
  criteria: {
    dir:    { perfect: [[160,180]], good: [[155,190]], mid: [[150,205]] },     // SE–S found (Wright)
    period: { perfect: [10,14], good: [9,16], mid: [8,18] },                    // 10–12 s found; rest est.
    height: { perfect: [5,8], good: [4,10], mid: [3,12] },                      // 3–12 ft found; tiers est.
    tide:   { perfect: [0.5,2.5], good: [0,3.5], mid: [-1,4.5], prefer: null }, // low–mid; numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 20 }, onshore: { good: 3, mid: 5 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Fickle sand-bottom wedge off the Newport Canyon at 18th St, mostly lefts, on hurricane SE–S swell. Only a few days a year; thick and hollow, serious above 8 ft.",
  other: ["Ultra crowded when on", "Rips; pollution after rain", "Parking near impossible on swell days"],
}
```

## Sources
- https://surfnerd.com/surf-forecast/huntington-beach-pier-northside
- https://surfnerd.com/surf-forecast/huntington-beach-pier-southside
- https://thesurfatlas.com/?p=3397
- https://www.surf-forecast.com/breaks/Huntington-Pier
- https://www.yeeew.com/listing/north-america/california/california-south/orange-county/huntington-pier-northside/forecast/
- https://surfnerd.com/surf-forecast/newport-lower-jetties
- https://en.wannasurf.com/spot/North_America/USA/California/Orange_County/the_wedge/
- https://www.surf-forecast.com/breaks/The-Wedge_1
- https://en.wikipedia.org/wiki/The_Wedge_(surfing)
- https://www.surfertoday.com/surfing/how-to-surf-and-survive-the-wedge
- https://socalforecast.blogspot.com/2008/03/surf-break-maps-newport-point-newport.html
- https://wannasurf.com/spot/North_America/USA/California/Orange_County/newport_point/
- https://www.surf-forecast.com/breaks/Newport-Point

## Where sources disagreed
- **HB North/South.** TheSurfAtlas and Yeeew say the south side favors W–NW and the north side favors S–SW. One other guide reverses this. My split is only moderately confident.
- **Lower Jetties.** No real conflict. Tide is "all tides" in one source and "rising best" in another.
- **Wedge.** The brief says SSE–S, but sources say S–SSW. Wind: N offshore (surf-forecast.com) vs. NW–W (Wannasurf). TravelDojo's "onshore" advice is an outlier, and I ignored it.
- **Newport Point.** Location: it is at 18th St by Newport Pier, not next to the Wedge. Direction: mostly lefts (Wright) vs. left (surf-forecast.com) vs. both ways (Wannasurf). Swell: SE–S short period (Wright) vs. SSW (generic sites). Tide: low vs. mid.
