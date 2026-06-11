# Gatherly Event Builder

Gatherly is a dependency-free event planning app for casual gatherings like BBQs, birthdays, picnics, game nights, potlucks, and fundraisers.

Open the app from a local server:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:8765/
```

Running from a server lets the browser fetch `grocery_item_store_matching_seed.csv` for grocery recommendations. If the CSV fetch is blocked, the app falls back to a small embedded grocery seed so the demo still proves the core workflow.

## What It Does

Gatherly helps the default organizer turn a loose event idea into an actionable plan. It tracks guests, budget, expenses, food and drink preferences, generated party tasks, task assignments, grocery recommendations, Spotify/Instacart integration placeholders, invite text, and calendar export.

The seeded demo starts with a 24-person backyard BBQ, assigned tasks for Alex and Jamie, budget tracking, grocery matching, and an invite preview.

## Implementation

Stack: plain HTML, CSS, and browser JavaScript. There is no build step, package manager, framework, or backend service.

Architecture:
- `index.html` defines the planner, preview, budget, task, and grocery recommendation surfaces.
- `styles.css` handles responsive layout, planner cards, invite preview, grocery cards, and mobile behavior.
- `app.js` owns state, local persistence, generated task logic, CSV parsing, grocery matching, task assignment, invite copying, and `.ics` calendar generation.
- `grocery_item_store_matching_seed.csv` provides normalized grocery items, categories, likely store types, example chains, confidence, and live-inventory source notes.

Key tradeoffs:
- Browser-only storage keeps the hackathon demo fast, private, and easy to deploy, but events are not shared across devices yet.
- Grocery recommendations use a static CSV seed plus deterministic alias rules instead of live retailer APIs. This proves the data flow while avoiding API-key and inventory instability during judging.
- Task and quantity generation is deterministic so browser verification can assert exact output.

## Production Readiness

Production-ready:
- Public no-auth demo flow.
- Deterministic seeded event state.
- Budget and expense tracking.
- Guest/task assignment model.
- CSV-backed grocery matching with fallback behavior.
- Calendar export and invite copy.
- Responsive static deployment path.
- Demo placeholders for Spotify playlist setup and Instacart cart connection.

Hackathon-grade:
- No multi-user accounts or shared event links yet.
- Grocery prices are not live; the CSV identifies likely store matches and live inventory sources.
- Quantities are heuristic estimates, not recipe- or nutrition-grade calculations.
- Local storage should be replaced with a database for real hosted events.
- Spotify and Instacart are staged as UI placeholders; production would require OAuth, API credentials, and provider review.

## Target Market

Primary user: the default organizer in friend groups, families, student clubs, neighborhood groups, and small workplace teams.

Reachable buyers or adopters:
- Student clubs and campus event organizers.
- Parent groups and neighborhood associations.
- Office admins and team culture leads.
- Community group volunteers who repeatedly coordinate food, supplies, and budgets.

This market is reachable because these groups already coordinate through lightweight tools like group chats, spreadsheets, Notes apps, and shared calendars. Gatherly fits that existing behavior while reducing back-and-forth messages and forgotten items.

## Browser Verification

Useful stable proof points:
- `data-testid="event-builder"`
- `data-testid="food-drink-preferences"`
- `data-testid="party-suggestions"`
- `data-testid="grocery-recommendations"`
- `data-testid="organizer-impact"`
- Visible readiness text: `Demo ready: grocery seed CSV loaded.` or `Demo ready: embedded grocery fallback loaded.`
