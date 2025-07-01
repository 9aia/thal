---
description: Tasks and items for the release.
---

# TODO

- Fix forgetting sidebar state after navigating to a route
- Fix the sidebar go back button not working
- Generate a new changelog and compare

- ---

## 0.1.0-12

- Improve URL sharing adding support to query and query values, eg. `/app/?build-character=motoko`
- Fix character edition error when the edition was approved and the user try to approve again without changes
- Add audio pause/resume button to chat messages
- Fixed speech missing speech stop on chat route leave

- Add confirmation modal on chat clear
- Improve sidebar error handling using:
   ```ts
    onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      // Retry after a delay
      setTimeout(() => retry(), 1000)
    } else {
      fail()
    }
  },
  ```
- Implement soft-deletes
- Revise Backlog (above `---`) and TODO
- Look for TODOS inside the codebase
- Fix error handling in the API endpoints fetched using form
- Create "about me" field in the profile page
- Enhance toast style widths
- Add high traffic UI alert

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

## 0.2.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"
