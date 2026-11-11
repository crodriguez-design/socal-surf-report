# Malibu / North LA spot research

Geometry note (my own reasoning, using approximate landmark coordinates): from this stretch, Anacapa and Santa Cruz Islands sit at about 255–272°, Point Mugu at about 290–300°, Santa Barbara Island at about 185°, and San Nicolas at about 215°. The result is a **NW window (≈275–300°) through the Santa Barbara Channel gap** between Anacapa and Point Mugu. Short-period **W (≈250–272°)** swell is partly blocked by the islands. **S/SW** swell is mostly open, with minor shadows from SBI and SNI. Point Dume (≈140° from Zuma and ≈260° from Topanga) blocks SE swell at Zuma and blocks W/NW at Topanga.

## County Line
- **Location**: 34.05197, -118.96087, from the Wannasurf pin (it fits the "just past Neptune's Net" description; surf-forecast's 34.07/-119.01 is coarse and inland). Facing ≈190° (est.). It's a reef/point right with a peaky sand-and-rock beach break inside.
- **Swell**: W/NW is the classic winter swell: Surf-forecast says best from W, and Wannasurf lists NW/W/SW. Late-summer S/W combos are also good (Surf Atlas). It has the best NW exposure on this list after Zuma.
- **Period**: ≥9 s is useful; 13–17 s is ideal.
- **Size**: 3–6 ft is good; it holds 6 ft+ (Wannasurf), and above ~8 ft the beach break closes out.
- **Tide**: Mid is best (surf-forecast). Low tide wedges the point and high tide favors the beach break (Surf Atlas).
- **Wind**: NNE is offshore. It's glassy at dawn, and W/SW onshore wind arrives by late morning or midday. Santa Anas blow hard and clean.
- **Other**: Crowded with real localism, rocks, cold water, and sea lions.

## Leo Carrillo
- **Location**: 34.04400, -118.93280, averaged from the Surfnerd and Mondo pins at Sequit Point. Facing ≈195° (Surfnerd says "faces S"). Right reef/cobble point.
- **Swell**: SW is ideal and S–W is workable (Surfnerd, surf-forecast). Wannasurf adds NW. It can't hold big winter swell.
- **Period**: ≥10 s; 14–18 s is ideal.
- **Size**: Fun at 3–6 ft and maxes out around 6–8 ft.
- **Tide**: Mid to high, rising (Wannasurf, surf-forecast). Surf Atlas says high only. Above ~4.5 ft it goes fat.
- **Wind**: N is offshore. Exposed to afternoon W wind, and Santa Ana gusts come down the canyon strong.
- **Other**: Narrow takeoff by a rock (room for 3–6 people), very crowded, and Arroyo Sequit runoff.

## Zuma
- **Location**: 34.02150, -118.83350, averaged from the Surfnerd and Mondo pins (central Zuma, around Westward/towers). Facing ≈210° (est.). Beach break with lefts and rights.
- **Swell**: Guides say SW is ideal, but Zuma is the most W/NW-exposed spot in north LA County (Surfnerd exposure extends to WNW; Surf Atlas mentions powerful winter sets). Point Dume blocks SE.
- **Period**: Useful from about 7 s, since it takes NW windswell; 12–16 s is ideal.
- **Size**: Good at 3–5 ft; it holds to double overhead (Wannasurf) but mostly closes out above ~6 ft.
- **Tide**: Mid, rising. High tide brings heavy shorepound.
- **Wind**: NE is offshore. It blows out early, so surf the dawn session.
- **Other**: Rips, heavy shorebreak, a submarine canyon, sharks, and fewer crowds.

## Topanga
- **Location**: 34.03700, -118.58250, averaged from the Surfnerd and Mondo pins at the point below the lot. Facing ≈190° (est.). Right point over boulders and sand, with a shorter outer section called "Boomers".
- **Swell**: S/SW is the bread and butter (Olahunter). Surfnerd and surf-forecast say W is ideal, but Point Dume shadows anything past ~260°, so only big or steep W swell wraps in.
- **Period**: ≥11 s; 14–18 s is ideal.
- **Size**: 3–7 ft is good; it holds to double overhead (Surfnerd).
- **Tide**: Mid is best, rising. Surfnerd says low to mid.
- **Wind**: N is offshore. Bay sea breeze from the SW.
- **Other**: Very crowded with unforgiving locals, and the lagoon/canyon runoff makes water quality poor after rain.

```js
{
  id: "county-line", name: "County Line", short: "County Line", region: "Malibu / North LA",
  lat: 34.05197, lon: -118.96087, facing: 190, // facing est.
  swellWindow: [[160,0],[175,.6],[190,.9],[230,1],[250,.7],[265,.5],[280,.9],[292,.8],[305,0]], // est.
  shadows: [{ dir: [250, 275], cut: 0.5 }, { dir: [180, 190], cut: 0.2 }], // islands; est.
  criteria: {
    dir:    { perfect: [[270,295]], good: [[200,295]], mid: [[175,305]] }, // est.
    period: { perfect: [13,18], good: [11,20], mid: [9,22] }, // est.
    height: { perfect: [4,6], good: [3,7], mid: [2,9] }, // est.
    tide:   { perfect: [1.5,3.5], good: [0.5,4.5], mid: [-0.5,5.5], prefer: null }, // est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 25 }, onshore: { good: 6, mid: 12 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Reef/point right with a beach break inside, at the county line by Neptune's Net. Best on winter W/NW groundswell that comes through the Channel gap, at mid tide with light N–NNE wind. Low tide wedges the point and high tide favors the beach break.",
  other: ["Localism: don't drop in", "Rocks, sea lions", "Afternoon W wind blows it out"],
}
```

```js
{
  id: "leo-carrillo", name: "Leo Carrillo State Beach", short: "Leo Carrillo", region: "Malibu / North LA",
  lat: 34.04400, lon: -118.93280, facing: 195,
  swellWindow: [[160,0],[175,.6],[195,1],[235,1],[255,.6],[270,.4],[285,.5],[300,0]], // est.
  shadows: [{ dir: [250, 275], cut: 0.5 }], // est.
  criteria: {
    dir:    { perfect: [[205,240]], good: [[185,250]], mid: [[170,295]] }, // perfect est.
    period: { perfect: [14,18], good: [12,20], mid: [10,22] }, // est.
    height: { perfect: [4,6], good: [3,6], mid: [2,8] },
    tide:   { perfect: [2.5,4.0], good: [1.5,4.5], mid: [0.5,5.5], prefer: "rising" }, // numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 22 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Mellow right over cobble and reef at Sequit Point, best on SW groundswell at mid-to-high rising tide. It doesn't hold size, and above ~4.5 ft tide it goes fat.",
  other: ["Tight takeoff next to a big rock", "Arroyo Sequit runoff after rain", "Longboard-friendly"],
}
```

```js
{
  id: "zuma", name: "Zuma Beach", short: "Zuma", region: "Malibu / North LA",
  lat: 34.02150, lon: -118.83350, facing: 210, // facing est.
  swellWindow: [[150,0],[165,.5],[185,.8],[215,1],[250,.8],[268,.6],[280,1],[300,.8],[310,0]], // est.
  shadows: [{ dir: [250, 272], cut: 0.4 }], // Anacapa/Santa Cruz; est.
  criteria: {
    dir:    { perfect: [[215,240],[275,300]], good: [[195,300]], mid: [[170,310]] }, // NW leg est.; perfect has two arcs, see notes
    period: { perfect: [12,16], good: [10,18], mid: [7,20] }, // est.
    height: { perfect: [3,5], good: [3,6], mid: [2,8] },
    tide:   { perfect: [2.0,4.0], good: [1.0,5.0], mid: [-0.5,6.0], prefer: "rising" }, // numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "medium",
  notes: "Open beach break and the most W/NW-exposed spot in north LA County, often surfing when the rest of Malibu is flat. Peaky sandbars at mid rising tide with NE wind, but it closes out above ~6 ft and blows out early.",
  other: ["Heavy shorepound, strong rips", "Submarine canyon; sharks reported", "Two perfect arcs: SW and NW"],
}
```

```js
{
  id: "topanga", name: "Topanga Beach", short: "Topanga", region: "Malibu / North LA",
  lat: 34.03700, lon: -118.58250, facing: 190, // facing est.
  swellWindow: [[155,0],[170,.6],[190,1],[235,1],[255,.6],[265,.3],[285,.1],[295,0]], // est.
  shadows: [{ dir: [255, 285], cut: 0.6 }], // Point Dume; long period wraps; est.
  criteria: {
    dir:    { perfect: [[200,240]], good: [[185,255]], mid: [[170,285]] }, // est.
    period: { perfect: [14,18], good: [12,20], mid: [11,22] }, // est.
    height: { perfect: [4,7], good: [3,8], mid: [2,12] },
    tide:   { perfect: [1.5,3.5], good: [0.5,4.5], mid: [-0.5,5.5], prefer: "rising" }, // numbers est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 22 }, onshore: { good: 6, mid: 12 } }, // est.
  },
  rainSensitive: true, crowd: "high",
  notes: "Long right point over boulders and sand, best on SW groundswell at mid tide with N wind. Big W swells wrap past Point Dume and can run 300 yards.",
  other: ["Very crowded; locals hard on newcomers", "Lagoon/canyon runoff is poor after rain", "Outer section 'Boomers'"],
}
```

## Sources
- https://en.wannasurf.com/spot/North_America/USA/California/Ventura/county_line
- https://www.surf-forecast.com/breaks/County-Line-Yerba-Buena-Beach
- https://en.wannasurf.com/spot/North_America/USA/California/LA_County/leo_carillo
- https://surfnerd.com/surf-forecast/leo-carrillo-state-beach-secos-arroyo-sequit
- https://www.surf-forecast.com/breaks/Leo-Carillo-State-Beach
- https://www.mondo.surf/surf-spot/leo-carillo/guide/2609
- https://en.wannasurf.com/spot/North_America/USA/California/LA_County/zuma_beach
- https://surfnerd.com/surf-forecast/zuma-beach-county-park
- https://www.surf-forecast.com/breaks/Zuma-Beach
- https://www.mondo.surf/surf-spot/zuma-beach/guide/2648
- https://surfnerd.com/surf-forecast/topanga-state-beach
- https://www.surf-forecast.com/breaks/Topanga-Point
- https://www.mondo.surf/surf-spot/topanga/guide/1389
- https://olahunter.blogspot.com/2010/12/la-surf-spot-review-topanga-beach_21.html
- https://thesurfatlas.com/surfing-in-the-usa/surfing-in-malibu/

**Disagreements**
- **County Line**: Wannasurf calls it a powerless beach break that works all tides; surf-forecast and Surf Atlas say reef/point at mid tide. Surf Atlas says late summer is best, while surf-forecast says January.
- **Leo Carrillo**: The tide call ranges from mid-low (Surfnerd) to mid-high (Wannasurf) to high only (Surf Atlas). Wannasurf lists offshore as SE/E/NE, but its own comment and the other sources say N.
- **Zuma**: Every guide says SW is ideal, yet Surf Atlas and the brief point to winter W/NW power. Surfnerd lists summer as the season, and Surf Atlas says winter/spring.
- **Topanga**: Surf-forecast and Surfnerd say W is ideal, while Olahunter says mainly S, with W only when it's huge. The tide call is mid versus low-mid.
