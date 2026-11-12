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

## 2. Wind: HRRR vs. NOAA station wind (past ~2 days, hourly)

| Station | Speed bias | Speed error | Direction error | Onshore/offshore call correct | "Over 6 mph onshore" call correct |
|---|---|---|---|---|---|
| Santa Monica (9410840) | −0.6 kt | ±1.7 kt | 31° | **95%** | 87% |
| Santa Barbara (9411340) | −1.0 kt | ±2.0 kt | 43° | **86%** | 83% |

NOAA's Los Angeles and Newport stations had no wind data in this window.

**What it means:** HRRR gets onshore vs. offshore right almost all the time, which is what most ratings hinge on. It reads about 0.5–1 kt light, so hours sitting right at the 6 mph Don't Go line can flip either way. Not adjusted from two days of data; worth re-checking with more.

## 3. Spot criteria: second source

Surfline's written spot guides (not their ratings) were read for 15 of the 18 new spots and used to adjust the research estimates — see `research/surfline-guides.md`.

## What still can't be checked from data
Face height *as surfed*, wave quality, sandbars, crowd effects. Only session logs (the app's "Log surf" button) can calibrate those.
