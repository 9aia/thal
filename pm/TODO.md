---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-9

- Fix discover search
- Fix characterBuilderData
- Add rate limit for user username changing
- Add rate limit error handling to username validation on client
- Notify error (specially username taken and invalid username) when approving character
- Use a single table for user and character usernames
- Rename table `CharacterUsername` to `Username`
- Check user changing usernames to taken ones

- Revision and adjust
  - Improve the design system and UI
  - Pre-create and refine default characters
  - Revise character content
  - Revise What's New
  - Revise screenshots
  - Revise content of policy pages
  - Revise prompt engineering
  - Revise landpage content
  - Update the README
  - Translate all content using Psitta
  - Revise translations
- Deploy
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.
