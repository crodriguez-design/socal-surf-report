# South Bay spot research: Burnout, Knob Hill

## Where "Burnout" is

The name points to one place, though sources draw its edges a little differently.

- **Candidate A (chosen): north end of Torrance County Beach, below Miramar Park.** A local history blog (No Bad Tides, Mar 2019) says surfers call the stretch of Torrance beach below the former Hollywood Riviera Beach Club "Burnout Beach." The club straddled the Torrance–Redondo city line and burned in 1958, which is where the name comes from. Miramar Park now sits on the site. OSM geocodes the park to 33.81498, -118.39045. Surf-forecast's "Burnout" page puts the break at 33.82, -118.39, and its "Torrance Beach/Burn Out" page puts it at 33.81, -118.40. Both bracket the park.
- **Candidate B (rejected): Topaz Street / Topaz Jetty, Redondo.** One travel guide (Yeeew, via a search snippet; the page returned 403) calls Topaz Street "also known as Burnout Beach." No other source backs this up. Topaz is about 3 km north, at the south edge of King Harbor.
- **Wider label:** Surfnerd lumps "Burn Out / Torrance Beach / R.A.T. Beach" together at 33.81225, -118.39283. Discover Torrance's spot list (HR, Ramp, TORR, PA, Bluffs, Cliff, RAT) doesn't use the name. Its "HR / Hollywood Riviera" peak at the north end matches Candidate A.

I couldn't reach Surfline (403), so I can't confirm which pin Surfline uses. Burnout is in **Torrance**, at the Redondo city line, about 1.5 km south of Knob Hill. It isn't in Palos Verdes.

## Burnout

**Location:** I put the break at 33.81520, -118.39180, which is Miramar Park's latitude projected onto the OSM coastline (-118.39161) plus about 20 m out to the surf zone. The OSM coastline here runs about 10° east of north, so the beach faces **280°**. That's W to slightly WNW, not WSW. It's a sand beach break. Peaks go both ways, with mostly rights according to surf-forecast and Surfnerd.

**Swell window:** Palos Verdes is the big factor. From this spot, Palos Verdes Point / Lunada area bears about 213° and Point Vicente about 192°, and Catalina covers roughly 173–208°. That leaves direct south swell (<205°) blocked. Long-period SSW (210–220°) wraps in weakly. Open water runs about 225–270°. San Nicolas and Santa Barbara Islands sit near 238°, but they're small. The Channel Islands (Santa Rosa, Santa Cruz, Anacapa) span about 272–288°, so short-period W/WNW gets cut there. Swell from beyond about 292° is behind Point Conception and only gets in by refraction. Sources say the best swells are W (surf-forecast "Burnout") and WNW (surf-forecast "Torrance Beach/Burn Out"). Surfnerd lists SW–NW with W best.

**Period:** at least 9 s to be useful; 13–17 s is ideal (est.).
**Size:** under 2 ft is flat; 2–3 ft is mid; 3–7 ft is good; 4–6 ft is perfect; over 8 ft closes out (est.). Surfnerd gives 1–6 ft as the working range, and an Easy Reader piece says it "packs a lot of power" even when small.
**Tide:** Surf-forecast says best around high. Surfnerd says higher tides give cleaner shape, it gets hollow on the outgoing, and the rising tide is preferred. Discover Torrance notes backwash and rips at low tide on the southern sections. In MLLW: best 2.5–4.5 ft, workable 1.5–5.5 ft, poor below 0.5 ft.
**Wind:** Offshore is E (about 80–100°). Even light onshore spoils it (surf-forecast review). The usual pattern is calm or light E in early mornings, then W/WSW sea breeze of 10–15 kt by noon. Santa Ana days are clean but often small.
**Other:** It's sand, so banks shift with winter swells. There are strong rips. Crowds are moderate. The Torrance beach storm drains mean it should be avoided for 72 hours after rain.

```js
{
  id: "burnout", name: "Burnout Beach", short: "Burnout", region: "South Bay",
  lat: 33.81520, lon: -118.39180, facing: 280,   // OSM coastline at Miramar Park latitude
  swellWindow: [[200,0],[210,.2],[220,.5],[230,.85],[245,1],[275,1],[290,.6],[300,.25],[310,0]], // est. from PV/Catalina/Conception geometry
  shadows: [{ dir: [272, 290], cut: 0.45 }],      // Channel Islands, short period; est.
  criteria: {
    dir:    { perfect: [[255,280]], good: [[240,290]], mid: [[215,300]] },  // est.
    period: { perfect: [13,17], good: [11,18], mid: [9,20] },               // est.
    height: { perfect: [4,6], good: [3,7], mid: [2,8] },                    // est.; surfnerd works 1–6 ft
    tide:   { perfect: [2.5,4.5], good: [1.5,5.5], mid: [0.5,6.5], prefer: "rising" }, // numbers est. from "high/rising"
    wind:   { offshore: { perfect: 10, good: 15, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "medium",
  notes: "Torrance beach break below Miramar Park (old Hollywood Riviera Beach Club site), tucked close to Palos Verdes, so it's mostly a W/WNW groundswell spot and south swells barely reach it. Punchy, mostly rights, best on a mid-to-high rising tide with morning E wind.",
  other: ["PV blocks swell from <205°; long-period SSW wraps weakly", "Strong rips; backwash at low tide", "Sandbars shift with winter swell", "Name comes from the 1958 beach club fire"],
}
```

## Knob Hill

**Location:** I put the break at 33.82860, -118.39140. Knob Hill Ave's west end geocodes (OSM) to 33.82857, -118.38521, and the OSM coastline at that latitude is about -118.3912. The coastline here runs almost due north–south, so the beach faces **268°** (W). It's a sand beach break with A-frame peaks, left and right. Knob Hill is in "the Avenues" stretch of south Redondo, about 1 km south of Topaz Jetty and about 1.5 km north of Burnout. The county lists the Knob Hill stairs as a beach access point.

**Swell window:** Palos Verdes Point bears about 209° from here, so Knob Hill opens a little further south than Burnout and catches more of a long-period SSW wrap. The Channel Islands shadow (272–288°) and the Point Conception cutoff (about 292°) are the same as at Burnout. The Redondo Canyon head is at King Harbor to the north. The only canyon claim I found is a single source saying it bends long-period swell away from Topaz. It's plausible that Knob Hill sits on the canyon's southern flank and gets some edge focusing, but I couldn't verify that. American Surf Magazine says these spots are best in winter, when wind swell combines with W swell.

**Period:** at least 8 s; 12–17 s ideal (est.).
**Size:** under 2 ft is flat; 2–3 ft is mid; 3–6 ft is perfect; over 8 ft closes out (est.). One Easy Reader anecdote from a huge swell: "The Avenues were 10-foot and the hill was at least twenty." It isn't certain "the hill" means Knob Hill.
**Tide:** The nearby Breakwater and Sapphire breaks favor low tide. A sand beach break here is probably best around mid tide. Best 1.5–3.5 ft, workable 0.5–4.5 ft, poor above 5.5 ft (all est.). No rising/falling preference was found.
**Wind:** Same as Burnout: offshore E, mornings best, Santa Anas glassy.
**Other:** There are storm drains along the Esplanade, so treat it as rain sensitive. Crowds are medium.

```js
{
  id: "knob-hill", name: "Knob Hill", short: "Knob Hill", region: "South Bay",
  lat: 33.82860, lon: -118.39140, facing: 268,   // Knob Hill Ave geocode + OSM coastline
  swellWindow: [[195,0],[205,.2],[215,.55],[228,.9],[240,1],[275,1],[290,.6],[300,.25],[310,0]], // est.
  shadows: [{ dir: [272, 290], cut: 0.45 }],      // Channel Islands, short period; est.
  criteria: {
    dir:    { perfect: [[250,280]], good: [[225,290]], mid: [[205,300]] },  // est.
    period: { perfect: [12,17], good: [10,18], mid: [8,20] },               // est.
    height: { perfect: [3,6], good: [2.5,7], mid: [2,8] },                  // est.
    tide:   { perfect: [1.5,3.5], good: [0.5,4.5], mid: [-0.5,5.5], prefer: null }, // est.
    wind:   { offshore: { perfect: 10, good: 15, mid: 25 }, onshore: { good: 5, mid: 10 } }, // est.
  },
  rainSensitive: true, crowd: "medium",
  notes: "South Redondo beach-break peaks at the foot of the Knob Hill stairs. It's open to W swell and gets a bit more SSW wrap than Burnout because it sits farther from Palos Verdes. Best on winter W groundswell with morning E wind around mid tide.",
  other: ["Redondo Canyon head is just north; focusing at this spot is unverified", "Sandbars shift seasonally", "Storm drains along the Esplanade"],
}
```

## Where sources disagreed

- **Burnout:** Location was disputed: Torrance/Miramar Park (blog, surf-forecast coordinates, Surfnerd) vs. Topaz Street (Yeeew). Best swell was W vs. WNW, and reliability ranged from "fairly consistent" to "only works a few times a year."
- **Knob Hill:** I found no dedicated break guide. Tide preference is inferred and conflicts with the low-tide preference of the nearby jetty breaks.

## Sources

- https://nobadtides.blogspot.com/2019/03/
- https://www.surf-forecast.com/breaks/Burnout
- https://www.surf-forecast.com/breaks/Torrance-Beach
- https://www.surf-forecast.com/breaks/Torrance-Beach/reviews
- https://surfnerd.com/surf-forecast/burn-out-torrance-beach-rat-beach/AXjTLsSatCRDZvnQH
- https://surfnerd.com/surf-forecast/topaz-street/r6hajeK2RpGrwcyLb
- https://surfnerd.com/surf-forecast/sapphire-street/29Ci6J5A4i5mQCqi2
- https://discovertorrance.com/?p=9287
- https://www.yeeew.com/listing/usa/california/california-south/los-angeles-county/south-bay (403, search snippet only)
- https://www.americansurfmagazine.com/article/the-secret-to-surfing-in-los-angeles (search snippet)
- https://beaches.lacounty.gov/?p=33244
- https://www.easyreadernews.com/storied-swell-biggest-swell-31-years-slams-south-bay/
- https://groups.google.com/g/surf-forecasting/c/xuBr1rpGfSY
- OpenStreetMap Nominatim (Miramar Park, Knob Hill Ave) and Overpass natural=coastline, used for coordinates and facing
- Surfline spot pages returned 403 and were not used
