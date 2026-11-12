# Accuracy checks (2026-11-11)

Objective checks of the app's two most important inputs, using measured data instead of opinions. Re-run these every few weeks; the scripts are described at the bottom.

## 1. Wave size: nearshore model vs. nearshore buoys (past ~4 days, hourly)

CDIP's nearshore model (MOP) at the model point closest to each buoy, compared with what the buoy measured:

| Buoy | Model point (distance) | Forecast ÷ measured | Forecast error | Nowcast ÷ measured | Nowcast error |
|---|---|---|---|---|---|
| Topanga Nearshore (103) | L0806 (1.2 km) | **0.68** | ±0.7 ft | 0.90 | ±0.3 ft |
| Capistrano Beach Nearshore (284) | OC106 (0.02 km) | **0.64** | ±1.2 ft | 0.95 | ±0.4 ft |
| Long Beach Channel (215) | L0129 (2.4 km — weak match) | 0.42 | ±1.5 ft | 0.72 | ±0.7 ft |

Average measured wave height at the buoys: 2.1–3.1 ft.

**What it means:**
- The raw nearshore *forecast* ran about a third too low all week.
- The buoy-fed *nowcast* was within 5–10% at the two well-matched buoys, so the app's live buoy correction (nowcast ÷ forecast) is pointed in the right direction and sized about right.
- The correction used to fade to nothing after ~30 hours, which would leave days 2–3 about a third undersized when the forecast runs low like this. **Change made:** half of the correction is now kept for the rest of the forecast (`CORR.keep = 0.5` in model.js).

## 1b. Second nearshore forecast (ECMWF-driven) — same buoys, same 4 days

| Buoy | Default (GFS-driven) forecast | ECMWF-driven forecast |
|---|---|---|
| Topanga Nearshore | ×0.68, ±0.7 ft | **×0.91, ±0.3 ft** |
| Capistrano Beach Nearshore | ×0.64, ±1.2 ft | **×1.03, ±0.4 ft** |

**Change made:** the app now uses CDIP's ECMWF-driven nearshore run as its main size forecast, with the live buoy correction on top. The default run is kept as a second opinion: both are matched to the buoys, then compared hour by hour to give each day a **forecast confidence** (solid / fair / shaky; day 3+ is never "solid").

## 2. Wind: HRRR vs. NOAA station wind (past ~2 days, hourly)

| Station | Speed bias | Speed error | Direction error | Onshore/offshore call correct | "Over 6 mph onshore" call correct |
|---|---|---|---|---|---|
| Santa Monica (9410840) | −0.6 kt | ±1.7 kt | 31° | **95%** | 87% |
| Santa Barbara (9411340) | −1.0 kt | ±2.0 kt | 43° | **86%** | 83% |

NOAA's Los Angeles and Newport stations had no wind data in this window.

**What it means:** HRRR gets onshore vs. offshore right almost all the time, which is what most ratings hinge on. It reads about 0.5–1 kt light, so hours sitting right at the 6 mph Don't Go line can flip either way. Not adjusted from two days of data; worth re-checking with more.

## 3. Spot criteria: second source

Surfline's written spot guides (not their ratings) were read for 15 of the 18 new spots and used to adjust the research estimates — see `research/surfline-guides.md`.

## Weekly automatic re-check
`alerts/accuracy.mjs` re-runs checks 1 and 2 every Monday morning as part of the surf-alerts job (or `FORCE_ACCURACY=1 node alerts/check.mjs`). It opens a "⚠️ Forecast accuracy drifted" issue only if the forecast or nowcast leaves ×0.8–1.25 of the buoys, or HRRR's onshore/offshore call drops below 80%. First run (2026-11-11): all within limits; HRRR read wind 1.3–2.7 kt light, worth watching.

## What still can't be checked from data
Face height *as surfed*, wave quality, sandbars, crowd effects. Only session logs (the app's "Log surf" button) can calibrate those.
