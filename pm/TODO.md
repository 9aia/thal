---
description: Tasks and items for the release.
---

# TODO

- Facilitate issue reporting (for e.g, on toast errors).
- Fix the sidebar loading component not rendering
- Fix forgetting sidebar state after navigating to a route
- Fix this:
  ```bash
  hook.js:608 [Vue warn]: Component inside <Transition> renders non-element root node that cannot be animated.
  ```
- Fix the iconify issue
  ```bash
  GET https://preview.thal.9aia.com/api/_nuxt_icon/material-symbols.json?icons=close-rounded - Ok @ 6/26/2025, 7:09:44 PM
  (error) [request error] [unhandled] [GET] https://preview.thal.9aia.com/api/_nuxt_icon/material-symbols.json?icons=close-rounded
  {
    message: 'No such module "@iconify-json/material-symbols/icons.json".',
    statusCode: 500
  }
  ```
- Implement soft-deletes
- Improve deployment process (facilitate the deployment of the app)

- Create "about me" field in the profile page
- Revise Backlog (above `---`) and TODO
- Fix error handling in the API endpoints fetched using form
- Enhance toast style widths

- Add high traffic UI alert

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

- Deploy to production
  - Set the GCP OAuth screen to production instead of testing (requires app verification).
  - Set Stripe to production instead of testing.
