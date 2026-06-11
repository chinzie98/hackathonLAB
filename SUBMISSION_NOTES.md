# Submission Update Notes

## Expanded Implementation

Gatherly is a static browser app built with HTML, CSS, and vanilla JavaScript. The app runs without a build step or backend, which made it fast to deploy on Vercel and reliable for judging. `index.html` defines the planner and invite preview, `styles.css` handles the responsive interface, `app.js` owns local event state, task generation, budget tracking, CSV parsing, grocery matching, assignment logic, invite copying, and `.ics` calendar export, and `grocery_item_store_matching_seed.csv` provides the grocery/store matching seed data.

The core architecture is browser-first: event state is stored in `localStorage`, generated party tasks are deterministic based on event type, headcount, budget, and food/drink preferences, and grocery recommendations are matched from a same-origin CSV file. The app prefers the real CSV and includes a small embedded fallback so the demo still works if a browser blocks local CSV loading.

Key tradeoff: we chose deterministic static data over live grocery APIs for the hackathon demo. This avoids API keys, live inventory instability, and third-party failures during judging while still proving the full workflow from event setup to assigned tasks and grocery recommendations.

## Production-Ready vs Hackathon-Grade

Production-ready pieces include the no-auth public demo, seeded event flow, budget and expense tracking, generated task logic, task assignment, CSV-backed grocery matching, calendar export, invite text copy, and responsive deployment.

Hackathon-grade pieces include local-only storage, heuristic quantity calculations, static grocery/store matching, and no shared guest links yet. A production version would add accounts, shared event URLs, database persistence, live grocery price/inventory integrations, and richer permissions.

## Target Customer and Reach

The primary user is the default organizer: the person in a friend group, family, student club, neighborhood group, or small workplace team who ends up coordinating the gathering. They already use group chats, spreadsheets, Notes apps, and shared calendars, so Gatherly is reachable because it fits an existing workflow while replacing scattered coordination with one planning surface.

Initial reachable communities include student clubs, parent groups, neighborhood associations, office admins, team culture leads, and community volunteers. These users repeat the same coordination problem often and can adopt a lightweight public web app without procurement or training.

## Demo Proof

The demo should show the seeded 24-person BBQ, assigned tasks for Alex and Jamie, budget tracking, generated food/drink tasks, CSV-backed grocery recommendations, and the Organizer Impact panel. Stable browser verification hooks are included with `data-testid` attributes for event builder, preferences, party suggestions, grocery recommendations, and organizer impact.
