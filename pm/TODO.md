---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-8

- Notify error (specially username taken) when approving character
- Inform you can't translate messages in deleted character chats
- Remove style attr from <Icon> instances

- Fix sign-in redirect URL host on preview
- Fix auth redirect with query params
- Add "Create another character" button for faster multiple creation

- Remove preview related stuff on prod
- Add .env.dev, .env.preview, .env.prod (and remove the info about need of change in docs)
- Move public keys to env

- Revision and adjust
  - Improve the design system and UI
  - Pre-create and refine default characters
  - Revise character content
  - Revise What's New
  - Revise content of policy pages
  - Revise prompt engineering
  - Revise landpage content
  - Update the README
  - Translate all content using Psitta
  - Revise translations
- Deploy
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.
