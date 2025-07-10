---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-14

- Fix router not pushing `/app` for some reason, so the settings navbar back button is not working properly
- Remove English help forms
- Lower every username comparison
- Inform to user about the project stage

- Pre-create and refine default characters
- Revise content of policy pages
- Add rate limit details to the pricing page
- Revise landpage content
- Revise screenshots
- Translate all content using Psitta
- Revise translations
- Deploy to production
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.

## 0.1.0-15

- Remove hooks and implement the delete in runtime
- Fix deletion of dependent data when renaming columns using `drizzle-kit + D1` (drizzle-kit deletes the table to create another one with the new name, so the dependent data because of onDelete hook)
- Add a backup database

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"

- Continue backlog
- Look for TODOS inside the codebase
