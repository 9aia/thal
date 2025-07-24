---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-18

- Configure Stripe dev sandbox (products, prices, webhooks, etc.)
- Replace checkout pages with a status modal inside the app
- Remove plan-* middlewares
- Adjust form actions, CTAs and content based on subscription status in CreateSessionForm, app notes and status modal
- Let users click on AI feature actions and receive feedback if they can't use them because of the subscription status
- Fix character builder catching 402 error on UI (it's not a problem, it's just a warning)
- How to ensure the app note is up to date?
- Create a dynamic pricing page that fetches the subscription plans from the API?
- Check and ensure Subscription status is being set properly

- ---

- Activate Stripe preview sandbox (products, prices, webhooks, etc.)
- Configure GCP prod
- Configure Google OAuth prod
  - Think about Google consent screen policies because it shows 9aia.com's policies
- Pre-release

### 0.1.0-18 (after)

- Simulate all statuses Thal purchase on preview sandbox
- Force test with ton of characters, chats, contacts and messages

- Configure Stripe prod sandbox (products, prices, webhooks, etc.)
- Configure GCP prod
- Configure Google OAuth prod
- Release EA (0.1.0)

## 0.1.0 (after)

- Create characters
- Share Thal with friends, family, colleagues, etc.

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"

- Continue backlog
- Look for TODOS inside the codebase
