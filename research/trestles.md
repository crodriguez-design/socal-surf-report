# Trestles: Upper and Lower (Orange County)

Both breaks sit on the cobblestone delta of San Mateo Creek at San Onofre State Beach (Trestles). The coastline runs about NW–SE here, so both face roughly SW. The shoreline lies between Dana Point to the NW and Point La Jolla / Point Loma to the SE. The open window is about 160–305°, and two islands cut into it. By my own bearing calculation from the break, **San Clemente Island** covers about 228–248° and **Catalina** about 260–278°. Short-period energy from those arcs is cut. Long-period groundswell wraps and partly fills the shadow. Swell from beyond 305° is blocked by Dana Point and the coast, and swell from below 160° by the San Diego headlands.

## Lower Trestles ("Lowers")

1. **Location**: 33.38278, −117.58868. This is wannasurf's GPS (33°22.967'N 117°35.321'W, listed as "approximate"), and it falls on the peak just south of the creek mouth. Facing ≈ 220° (est., from the coastline trend). It is a cobblestone reef/point with an A-frame peak: a long right and a shorter, hollow left.
2. **Swell window**: Adam Wright (socalforecast) gives a best arc of S–SSW, **170–220°**. Matt Biolos calls S the best direction, but too much S/SE (hurricane swell) makes the right break over the shelf. W/NW swell works but is weaker and walled. SCI shadows short-period SW energy.
3. **Period**: useful from about 9 s. Ideal 14–20 s Southern Hemisphere groundswell.
4. **Size** (face): flat below 2 ft, mid 2–3, good 3–10, perfect 4–8 (Surfline's "best" is 4–10). It holds 12 ft or more per wannasurf, but above about 12 ft the peak gets chaotic and very crowded.
5. **Tide**: Biolos says mid to incoming. Others say med-low to med-high, or that tide hardly matters on the cobble. Best 1.5–4 ft, workable 0.5–5, poor below −0.5 or above 6 (fat and backwashy). Prefer a **rising** tide.
6. **Wind**: offshore from E/NE (about 45–90°). Light to moderate Santa Anas are the best case. Light wind is fine from any direction except S. The usual pattern is glassy or light E early, then a W/SW sea breeze by late morning.
7. **Other**: Best in summer and fall. Rated world class and "ultra crowded" every day, with a localized, high-skill lineup. The walk is 15–30 min (≈1–1.5 mi) from the Cristianitos lot, past the tracks. Hazards are slippery algae-covered cobbles and urchins. After rain, the creek mouth runs right through the lineup. The county's 72-hour rain advisory covers San Onofre southward, and Trestles is sampled weekly.

```js
{
  id: "lowers", name: "Lower Trestles", short: "Lowers", region: "Orange County",
  lat: 33.38278, lon: -117.58868, facing: 220, // facing est.
  swellWindow: [[155,0],[165,.5],[175,.9],[185,1],[215,1],[230,.8],[245,.6],[262,.4],[278,.35],[292,.35],[302,.15],[310,0]], // est. from bearings
  shadows: [{ dir: [228,248], cut: 0.4 }, { dir: [260,278], cut: 0.5 }], // SCI, Catalina; cuts est.
  criteria: {
    dir:    { perfect: [[180,215]], good: [[170,230]], mid: [[160,295]] },  // S+WNW combo also excellent (est.)
    period: { perfect: [14,20], good: [12,22], mid: [9,22] },               // est.
    height: { perfect: [4,8], good: [3,10], mid: [2,12] },
    tide:   { perfect: [1.5,4], good: [0.5,5], mid: [-0.5,6], prefer: "rising" }, // ft values est. from "mid/incoming"
    wind:   { offshore: { perfect: 12, good: 18, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "World-class cobblestone A-frame: long right, short fast left. Best on S–SSW groundswell at mid, rising tide with light E/NE wind. Expect a packed, high-level lineup and a long walk.",
  other: ["15–30 min walk from Cristianitos lot", "Extremely crowded and localized", "Slippery algae cobbles, urchins", "San Mateo Creek runoff: skip for 72 h after rain", "Too much S/SE swell makes the right break over the shelf"],
}
```

## Upper Trestles ("Uppers")

1. **Location**: 33.38557, −117.59438. This is wannasurf's GPS (33°23.134'N 117°35.663'W, approximate), just north of the creek mouth near the lifeguard tower and bridge. Facing ≈ 225° (est.). It is a rocky reef/point, mainly a right with some lefts, and less defined than Lowers. It has several peaks.
2. **Swell window**: Adam Wright gives a best arc of **W–WNW, 270–285°**, and also likes S/WNW combos. Surf-forecast says W. It also works on S/SW, but catches fewer of those swells than Lowers does. The best W arc sits right at the edge of the Catalina shadow, so it needs long period to wrap in.
3. **Period**: useful from about 8 s. Ideal 13–18 s.
4. **Size** (face): flat below 2 ft. Starts working around 3 ft and holds 10 ft or more per wannasurf. Good to about double overhead. Sectiony on bigger swells.
5. **Tide**: Wright says it wants water over the rocks, "at least the tide-push after the low," but not full high. Surf-forecast says best around low, and wannasurf says low to mid. Best 0.5–3 ft, workable 0–4, poor below −1 or above 5. Prefer a **rising** tide.
6. **Wind**: same as Lowers, E/NE offshore with light Santa Anas best. Light SE is OK.
7. **Other**: The winter spot of Trestles. Crowded, though multiple peaks spread people out more than at Lowers. Hazards are rock, urchins and mussels. The walk is similar. It sits closer to the creek mouth, so it is at least as rain-sensitive as Lowers.

```js
{
  id: "uppers", name: "Upper Trestles", short: "Uppers", region: "Orange County",
  lat: 33.38557, lon: -117.59438, facing: 225, // facing est.
  swellWindow: [[160,0],[175,.6],[190,.8],[215,.85],[230,.7],[245,.6],[262,.5],[278,.55],[290,.6],[300,.35],[310,0]], // est. from bearings
  shadows: [{ dir: [228,248], cut: 0.4 }, { dir: [260,278], cut: 0.5 }], // SCI, Catalina; cuts est.
  criteria: {
    dir:    { perfect: [[265,290]], good: [[200,295]], mid: [[170,305]] },  // S+WNW combo also perfect per Wright
    period: { perfect: [13,18], good: [11,20], mid: [8,22] },                // est.
    height: { perfect: [4,8], good: [3,10], mid: [2,12] },                   // perfect est.
    tide:   { perfect: [0.5,3], good: [0,4], mid: [-1,5], prefer: "rising" }, // ft values est.
    wind:   { offshore: { perfect: 12, good: 18, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Rocky right-hand reef/point with several peaks, best on W–WNW groundswell or S/WNW combos at low-to-mid rising tide with E/NE wind. Handles W/NW better than Lowers and is a little less packed.",
  other: ["15–30 min walk from Cristianitos lot", "Crowded; multiple peaks spread it", "Rocks, urchins, mussels", "Right by creek mouth: skip for 72 h after rain", "Sectiony on big swells"],
}
```

## Sources
- https://socalforecast.blogspot.com/2008/02/surf-break-map-upper-trestles-trestles.html
- https://socalforecast.blogspot.com/2008/02/surf-break-map-lower-trestles-trestles.html
- https://www.surf-forecast.com/breaks/Trestles_Uppers
- https://www.surf-forecast.com/breaks/Trestles_Lowers
- https://en.wannasurf.com/spot/North_America/USA/California/Orange_County/upper_trestles/
- https://en.wannasurf.com/spot/North_America/USA/California/Orange_County/lower_trestles/
- https://www.americansurfmagazine.com/article/how-to-surf-trestles
- https://origin.worldsurfleague.com/posts/130378/break-breakdown-trestles (Matt Biolos)
- https://www.everydaycalifornia.com/blogs/everyday-thoughts/lower-trestles
- https://timesofsandiego.com/health/2024/02/01/rain-advisory-issued-for-san-diego-county-coastal-waters/ (rain advisory covers San Onofre south)
- https://www.theswimguide.org/beach/10797 (weekly sampling at San Onofre–Trestles)

Island shadow arcs come from my own great-circle bearings from the break to San Clemente Island, Catalina, Dana Point and Point Loma. They are not from a source.

**Disagreements:**
- **Lowers**: tide advice differs. Surf-forecast says tide doesn't matter, Biolos says mid/incoming, Everyday California says mid–high, and American Surf Magazine says med-low to med-high. Wannasurf lists N/NW swell as "good" even though Lowers faces SW.
- **Uppers**: best direction is given as W (surf-forecast, Wright 270–285) or SW (one guide). Tide is given as low (surf-forecast) versus "push after low, not high" (Wright) versus low–mid (wannasurf).
