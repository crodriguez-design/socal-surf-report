# Santa Barbara / Ventura: spot research

## Geometry common to all five spots

All five sit inside the Santa Barbara Channel. I worked out the window bearings from the coordinates (great-circle approximation, so they are estimates):

- **West door (main swell source):** this is the gap between Point Conception and San Miguel Island. From Rincon it spans about 247–276°. From Ventura it spans about 256–281°. A W swell (260–280°) comes straight down the channel. WNW/NW from 285° and up is in Point Conception's shadow, and only longer periods refract in. One source notes that very long-period WNW (16 s or more) tends to focus on the Ranch, not Rincon, so Rincon is best on W swells of 12–15 s.
- **Island wall:** San Miguel, Santa Rosa, Santa Cruz and Anacapa block roughly 195–250°. Short-period SW is basically gone. Long-period SW (17 s or more) leaks through the island gaps at reduced size.
- **South door (Anacapa Passage):** this is the gap between Anacapa Island and Point Mugu, about 135–190° from Ventura and about 130–170° from Rincon. SSE–S swells come through it. Rincon's points face too far south-southwest to wrap them well, though they give Indicator its summer lefts. Ventura Harbor's beach faces WSW, sits further south and east, and is open to about 135–200°. That makes it the best summer south-swell catcher of the five (confirmed by Surfnerd's window, by Surf Atlas's "SW swells from May onwards", and by surf-forecast's WSW best direction).

## Spot notes

**Rincon (The Cove):** the inside section, a cobblestone right point beside Highway 101. Best on W swell at low to mid tide, ideally falling. At high tide on big swells, the end of the wave runs into the freeway boulders. It holds NW wind better than any other spot nearby. Location: Rincon Creek mouth geocoded through OSM (34.37415, −119.47712), then offset about 300 m ESE into the Cove.

**Rincon (Indicator):** the outer takeoff at the top of the point. It needs more size to break properly and connect, with double overhead at Indicator shrinking to chest–shoulder high by the inside. It also handles tide better (sources say "all tides"). Small S swells give a few lefts here in summer. Location: offset about 250 m W/SW of the OSM Rincon Point node (34.37419, −119.47664).

**Ventura Point (Surfers Point / Pipe / Stables):** cobble and sand right point at the Ventura River mouth, with the faster, hollower "Pipe" at the top. Very consistent, holding 3 ft to 15 ft or more. Best at low to mid tide, ideally rising; at high tide the entry and exit get rocky. Sources disagree on wind: NE offshore versus N/NW being acceptable. Location: OSM "Surfers Point Phase II" (34.27441, −119.30417), moved to the shoreline.

**C Street:** the lower, softer cove section toward the pier. It is a longboard and beginner-friendly wave that needs less size and closes out or gets swamped sooner. Location: between OSM Surfers Point Park (34.27409, −119.30035) and Ventura Pier (34.27419, −119.29145).

**Ventura Harbor (South Jetty / Surfers Knoll):** sand beach break with a jetty-groomed peak. Sources conflict on whether the left or the right off the jetty is the main wave. Of the five, it best picks up S/SW summer swell and local windswell, and it works on solid W swell. Best mid tide on the rise. It closes out above about 7–8 ft and blows out sooner than the points. Location: Surfnerd's spot coordinate (34.24508, −119.26799).

**Wind (all five):** offshore is NE–N. The usual pattern is glassy or light offshore at dawn, then W/SW onshore from about 11 am, sometimes easing near sunset. Santa Ana and sundowner events give strong NE offshores. The points stay clean in them, but the Harbor beach break gets wind-chopped and hard to paddle into.

**Water quality:** all five are rain-sensitive (Rincon Creek, the Ventura River and the Santa Clara River). Rincon south of the creek failed state bacteria standards in an April 2026 county report.

```js
{
  id: "rincon-cove", name: "Rincon (The Cove)", short: "Rincon Cove", region: "Santa Barbara / Ventura",
  lat: 34.37290, lon: -119.47420, facing: 200,          // est. offset from OSM Rincon Creek mouth
  swellWindow: [[130,0],[150,.15],[170,.15],[195,.05],[235,.1],[250,.6],[262,1],[278,1],[288,.6],[300,.25],[315,0]], // est.
  shadows: [{ dir: [195, 250], cut: 0.3 }, { dir: [285, 315], cut: 0.5 }],   // est. islands / Pt Conception
  criteria: {
    dir:    { perfect: [[260,280]], good: [[250,290]], mid: [[240,305]] },
    period: { perfect: [12,15], good: [11,17], mid: [9,20] },
    height: { perfect: [4,8], good: [3,10], mid: [2,12] },             // est.
    tide:   { perfect: [0,2.5], good: [-0.5,3.5], mid: [-1.5,5], prefer: "falling" }, // est. numbers
    wind:   { offshore: { perfect: 12, good: 20, mid: 30 }, onshore: { good: 8, mid: 14 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Inside section of Rincon: long cobblestone right, best on W swell at low/falling tide. Holds NW wind better than anything nearby. Big swell at high tide drives the end of the wave into the 101 boulders.",
  other: ["Basically flat in summer", "Rincon Creek bacteria after rain", "Extremely crowded on any real swell", "Rocks, sharks, car break-ins"],
}
```

```js
{
  id: "rincon-indicator", name: "Rincon (Indicator)", short: "Indicator", region: "Santa Barbara / Ventura",
  lat: 34.37320, lon: -119.47950, facing: 220,          // est. offset from OSM Rincon Point node
  swellWindow: [[125,0],[145,.25],[170,.25],[195,.05],[235,.15],[248,.7],[260,1],[280,1],[290,.6],[305,.25],[320,0]], // est.
  shadows: [{ dir: [195, 248], cut: 0.3 }, { dir: [285, 320], cut: 0.5 }],   // est.
  criteria: {
    dir:    { perfect: [[258,280]], good: [[248,290]], mid: [[240,305]] },
    period: { perfect: [12,16], good: [11,18], mid: [9,20] },
    height: { perfect: [6,10], good: [4,12], mid: [3,15] },            // est. needs more size than Cove
    tide:   { perfect: [0.5,3.5], good: [-0.5,4.5], mid: [-1.5,6], prefer: "falling" }, // est.
    wind:   { offshore: { perfect: 12, good: 20, mid: 28 }, onshore: { good: 6, mid: 12 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Outer takeoff at the top of the point. It needs a solid W swell to break properly and connect toward Rivermouth and the Cove, and it is more tide-tolerant than the Cove. Small S swells give a few lefts in summer.",
  other: ["More exposed to wind than the Cove", "Waves shrink fast toward the inside", "Hidden from the freeway, so you can't see it from the road", "Rocks, sharks"],
}
```

```js
{
  id: "ventura-point", name: "Ventura Point", short: "Ventura Pt", region: "Santa Barbara / Ventura",
  lat: 34.27380, lon: -119.30420, facing: 205,          // OSM Surfers Point Phase II, moved to waterline (est.)
  swellWindow: [[130,0],[145,.35],[185,.35],[195,.1],[245,.15],[255,.7],[265,1],[282,1],[292,.6],[305,.3],[320,0]], // est.
  shadows: [{ dir: [195, 252], cut: 0.3 }, { dir: [285, 320], cut: 0.5 }],   // est.
  criteria: {
    dir:    { perfect: [[260,285]], good: [[250,295]], mid: [[150,305]] },
    period: { perfect: [12,16], good: [10,18], mid: [8,20] },
    height: { perfect: [4,8], good: [3,10], mid: [2,14] },             // found: 3 to 15 ft or more; tiers est.
    tide:   { perfect: [1,3.5], good: [0,4.5], mid: [-1,5.5], prefer: "rising" }, // est. numbers
    wind:   { offshore: { perfect: 12, good: 20, mid: 30 }, onshore: { good: 6, mid: 12 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Cobble and sand right point at the Ventura River mouth, with the faster, hollower Pipe at the top. Very consistent on W/NW swell and holds real size. Entry and exit get rocky at high tide.",
  other: ["Ventura River runoff after rain", "Strong currents and hard paddle when big", "Crowded with some localism", "Picks up S swell weakly through the Anacapa Passage"],
}
```

```js
{
  id: "c-street", name: "C Street (Ventura)", short: "C Street", region: "Santa Barbara / Ventura",
  lat: 34.27330, lon: -119.29650, facing: 205,          // est. between Surfers Point Park and Ventura Pier
  swellWindow: [[130,0],[145,.35],[185,.35],[195,.1],[245,.15],[255,.65],[265,1],[282,1],[292,.55],[305,.25],[320,0]], // est.
  shadows: [{ dir: [195, 252], cut: 0.3 }, { dir: [285, 320], cut: 0.5 }],   // est.
  criteria: {
    dir:    { perfect: [[258,285]], good: [[250,295]], mid: [[150,305]] },
    period: { perfect: [11,15], good: [9,17], mid: [7,20] },           // est.
    height: { perfect: [3,5], good: [2,7], mid: [1.5,9] },             // est.
    tide:   { perfect: [1,3.5], good: [0,4.5], mid: [-1,6], prefer: "rising" }, // est.
    wind:   { offshore: { perfect: 12, good: 18, mid: 28 }, onshore: { good: 6, mid: 12 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "The softer inside cove of the Ventura point toward the pier. A longboard and beginner-friendly wave that is fun when small. It gets swamped or closes out sooner than the top of the point.",
  other: ["Busiest lineup in the county", "Runoff and pollution after rain", "Parking is tough", "Mushier at higher tide"],
}
```

```js
{
  id: "ventura-harbor", name: "Ventura Harbor", short: "Ventura Harbor", region: "Santa Barbara / Ventura",
  lat: 34.24508, lon: -119.26799, facing: 240,          // Surfnerd spot coordinate
  swellWindow: [[125,0],[140,.4],[160,.7],[190,.7],[205,.35],[220,.15],[245,.2],[255,.7],[265,1],[280,1],[290,.5],[305,.2],[315,0]], // est.
  shadows: [{ dir: [205, 252], cut: 0.35 }, { dir: [285, 315], cut: 0.5 }], // est.
  criteria: {
    dir:    { perfect: [[160,195],[260,280]], good: [[150,280]], mid: [[135,295]] }, // S + W combo peaks; single-range tiers approximate
    period: { perfect: [12,17], good: [9,18], mid: [6,20] },           // est. windswell works
    height: { perfect: [3,5], good: [2,6], mid: [1.5,8] },             // est. closes out above about 7-8 ft
    tide:   { perfect: [1.5,4], good: [0.5,5], mid: [-0.5,6], prefer: "rising" }, // est. numbers
    wind:   { offshore: { perfect: 10, good: 15, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "medium",
  notes: "Sand beach break with a jetty-groomed peak at the South Jetty and Surfers Knoll. It is the most open of the five to S/SW summer swell and local windswell, and it works on solid W swell. It closes out on big swells and blows out sooner than the points.",
  other: ["Best summer option in this region", "Rocks at the jetty; the left can push you onto them", "Santa Clara River and harbor runoff after rain", "Competitive local groms"],
}
```

## Sources

- https://socalforecast.blogspot.com/2008/02/surf-break-maps-rincon-point-santa.html (Adam Wright, Rincon break map)
- https://en.wikipedia.org/wiki/Rincon_(surfspot)
- https://www.surf-forecast.com/breaks/Rincon-3
- https://www.surf-forecast.com/breaks/Rincon-Point
- https://www.surf-forecast.com/breaks/Ventura-Point-California-Street
- https://www.surf-forecast.com/breaks/New-Jetty-South-Jetty
- http://en.wannasurf.com/spot/North_America/USA/California/Ventura/ventura_point/
- https://surfnerd.com/surf-forecast/california-street-c-street/cFuyerFBNfNM2gDbQ
- https://surfnerd.com/surf-forecast/ventura-harbor/KdmtETDzMzE6e2Edm
- https://surfnerd.com/surf-forecast/new-jetty-south-jetty/rDNMKTTLBfKpW7gZw
- https://thesurfatlas.com/surfing-in-the-usa/surfing-in-ventura/
- https://www.americansurfmagazine.com/article/ventura-surf-guide
- https://venturacountycoast.com/hang-loose-and-have-fun-at-ventura-county-coasts-top-6-surf-spots/
- https://rmadocs.venturacounty.gov/environmental-health/press-releases/publications/2026-04-16-environmental-health-ocean-water-quality-monitoring-report.pdf
- https://nominatim.openstreetmap.org (geocodes: Rincon Point, Rincon Creek, Surfers Point, Ventura Pier)

## Where sources disagreed

- **Rincon Cove:** surf-forecast says NNW swell, NW wind and low falling tide. Wright and Wikipedia say W is best, with low tide best. I went with W and low/falling.
- **Indicator:** surf-forecast says WNW swell and all tides. Wright says WNW is tricky and W is best. I went with W and more tide tolerance than the Cove.
- **Ventura Point:** wannasurf says all tides and N/NW wind are fine. Surfnerd says low to mid tide, rising. Surf-forecast says NE wind. I went with NE offshore and low to mid, rising.
- **C Street:** sources lump it in with Ventura Point. My separate size and tide numbers for C Street are inferences.
- **Ventura Harbor:** sources split on whether the left or the right is the main wave, on whether the best season is summer or fall–winter, and on whether the best swell is SW or WSW. The geometry supports S/SSW plus W.
