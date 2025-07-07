---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-12

- Lower every username comparison
- Look for TODOS inside the codebase
- Remove the Home page on mobile (Welcome modal will be better)
- Add a welcome modal and add a link to it in the settings page
- Implement character builder and contact manager to use sidebar param, eg. `/app/?build-character=motoko`
- Fix deletion of dependent data when renaming columns using `drizzle-kit + D1` (drizzle-kit deletes the table to create another one with the new name, so the dependent data because of onDelete hook)
  - Remove hooks and implement the delete in runtime (using soft-deletes ideally)
  - Implement soft-deletes
- Add confirmation modal on chat clear
- Add high traffic UI alert
- Add a backup database

- Revision and adjust
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

- Deploy to production
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.

## 0.1.0-13

- Revise Backlog (above `---`) and TODO

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"
