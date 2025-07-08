---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-12

- Pre-create and refine default characters
- Revise content of policy pages
- Revise What's New
- Revise landpage content
- Revise screenshots
- Translate all content using Psitta
- Revise translations

## 0.1.0-13

- Inform to user about the project status
- Implement soft-deletes
- Lower every username comparison
- Deploy to production
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.

## 0.1.0-14

- Remove hooks and implement the delete in runtime (using soft-deletes ideally)
- Fix deletion of dependent data when renaming columns using `drizzle-kit + D1` (drizzle-kit deletes the table to create another one with the new name, so the dependent data because of onDelete hook)
- Add a backup database

- Implement character builder and contact manager to use sidebar param, eg. `/app/?build-character=motoko`
- Add high traffic UI alert
- Continue backlog
- Look for TODOS inside the codebase

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"
