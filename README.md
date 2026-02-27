# Time Master Hub

A modern multi-tool web project that combines **time utilities** and **network utilities** in one clean, responsive interface.

Time Master Hub includes:
- A precise **Stopwatch** with lap tracking.
- A **World Time** dashboard with live clocks and timezone selection.
- A dual-player **Chess Clock** for turn-based games.
- An **IP Checker** with detailed IP metadata and an estimated malicious-risk score.
- A **DNS Checker** for common DNS records (A, AAAA, MX, NS, TXT, CNAME).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [How to Run Locally](#how-to-run-locally)
6. [Tool-by-Tool Details](#tool-by-tool-details)
7. [External APIs Used](#external-apis-used)
8. [Design & UX Notes](#design--ux-notes)
9. [Known Limitations](#known-limitations)
10. [Future Improvements](#future-improvements)
11. [License / Copyright](#license--copyright)

---

## Project Overview

Time Master Hub is a static front-end web app made with HTML, CSS, and vanilla JavaScript.

The app is organized into dedicated pages for each tool and a central home page for navigation:
- `index.html` → Home / tool launcher
- `stopwatch.html` → Stopwatch tool
- `world-time.html` → World clock tool
- `chess-clock.html` → Chess clock tool
- `ip-checker.html` → IP analysis tool
- `dns-checker.html` → DNS lookup tool

All tools share a unified visual style from `styles.css`.

---

## Features

### 1) Stopwatch
- Start, pause, and reset controls.
- Lap recording list.
- High-resolution timing based on `performance.now()`.
- Readable `HH:MM:SS.CS` display format.

### 2) World Time
- Default live clocks for:
  - UTC
  - GMT (`Europe/London`)
  - EST (`America/New_York`)
  - IST (`Asia/Kolkata`)
- Dropdown to add additional predefined timezones.
- Remove individual timezone cards.
- Clock updates every second using `Intl.DateTimeFormat`.

### 3) Chess Clock
- Configurable base minutes per player.
- Start / Resume, Pause, and Reset actions.
- Active-player highlighting.
- Turn switching by tapping the currently active player's side.
- Time-flag detection and game-over status message.

### 4) IP Checker
- Lookup for current public IP (if input is empty) or user-specified IP.
- Shows detailed fields such as:
  - IP
  - Country, region, city
  - Timezone
  - ISP/organization
  - ASN
  - Proxy/hosting/mobile indicators
- Displays an estimated malicious score (`0–100`) based on risk heuristics.

### 5) DNS Checker
- Domain lookup for common record types:
  - A
  - AAAA
  - MX
  - NS
  - TXT
  - CNAME
- Displays grouped results by record type.
- Handles "no records found" per type.

---

## Tech Stack

- **HTML5** for page structure
- **CSS3** for responsive styling and shared design system
- **Vanilla JavaScript (ES6+)** for behavior and data fetching
- Browser-native APIs:
  - `fetch`
  - `Intl.DateTimeFormat`
  - `performance.now()`

No framework, bundler, or backend is required.

---

## Project Structure

```text
clock/
├── index.html
├── stopwatch.html
├── world-time.html
├── chess-clock.html
├── ip-checker.html
├── dns-checker.html
├── styles.css
├── stopwatch.js
├── world-time.js
├── chess-clock.js
├── ip-checker.js
└── dns-checker.js
```

---

## How to Run Locally

Because this project uses browser APIs and external requests, run it with a local HTTP server.

### Option A: Python HTTP server

```bash
cd /workspace/clock
python3 -m http.server 4173
```

Then open:

- `http://127.0.0.1:4173/index.html`

### Option B: Any static server

Any static hosting/server (Nginx, Apache, Vercel static, Netlify static, etc.) works.

---

## Tool-by-Tool Details

### Home (`index.html`)
- Serves as a central dashboard with cards to each tool.
- Keeps navigation simple and discoverable.

### Stopwatch (`stopwatch.html`, `stopwatch.js`)
- Maintains elapsed time using delta from `performance.now()`.
- Avoids drift from repeatedly accumulating fixed intervals.
- Supports lap snapshots shown newest-first.

### World Time (`world-time.html`, `world-time.js`)
- Builds timezone cards dynamically.
- Uses timezone-aware formatting via `Intl.DateTimeFormat`.
- Refreshes all visible clocks every second.

### Chess Clock (`chess-clock.html`, `chess-clock.js`)
- Uses a frequent tick interval and frame-independent delta subtraction.
- Prevents negative display by clamping at `0`.
- Stops game and declares winner on timeout.

### IP Checker (`ip-checker.html`, `ip-checker.js`)
- Calls external API and maps response fields into UI cards.
- Computes a heuristic score from risk-like indicators (proxy/hosting/vpn/tor/cloud hints).
- Score is informative and not a certified security verdict.

### DNS Checker (`dns-checker.html`, `dns-checker.js`)
- Queries DNS-over-HTTPS endpoint for each record type.
- Renders each type in its own section for clarity.
- Gracefully handles missing answers.

---

## External APIs Used

### 1) IP Data API
- Endpoint pattern: `https://ip-api.com/json/{query}`
- Used in: `ip-checker.js`
- Purpose: public IP metadata and network context.

### 2) Google DNS-over-HTTPS API
- Endpoint pattern: `https://dns.google/resolve?name=...&type=...`
- Used in: `dns-checker.js`
- Purpose: DNS record lookups.

> **Important:** API behavior may depend on provider limits, network policies, and browser CORS rules.

---

## Design & UX Notes

- Dark gradient background with glassmorphism-like cards.
- Shared UI components for consistency across pages.
- Responsive layouts for desktop and mobile widths.
- Clear status text for loading, success, and error states.

---

## Known Limitations

1. **No backend secret management**
   - Everything runs client-side.

2. **IP malicious score is heuristic**
   - It is not a threat-intelligence-grade reputation service.

3. **DNS/IP checks depend on external services**
   - Network failures or API restrictions can impact results.

4. **No automated test suite yet**
   - Syntax checks and manual browser validation are currently used.

---

## Future Improvements

- Add unit tests for timer and formatter utilities.
- Add record-type filtering and export for DNS results.
- Add historical lap export for stopwatch.
- Add increments/delay modes for chess clock.
- Improve accessibility (keyboard flow, ARIA labels, focus states).
- Add optional backend proxy for robust API handling and rate-limit control.

---

## License / Copyright

© 2026 dipnarayan.n. All rights reserved.
