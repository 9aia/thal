---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-18

- Handle first access to the app (no subscription yet because webhook is not triggered yet)
- Replace checkout pages with a status modal inside the app
  - Change payment required modal (unpaid is actually when automatic renewal was not successful)
  - Check subscription status on message send
- Remove plan-* middlewares
- Create a dynamic pricing page that fetches the subscription plans from the API?

- Handle "checkout success, but processing payment" in status modal

- Fix character builder catching 402 error on UI (it's not a problem, it's just a warning)
- How to ensure the app note is up to date?

- ---
- Update Whats New first release content
- Add a safety notice below the chat input

## 0.1.0

- Configure GCP OAuth screen and set it to production instead of testing (requires app verification)
- Configure Stripe to production instead of testing
- Deploy to production
- Create characters

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"

- Continue backlog
- Look for TODOS inside the codebase
