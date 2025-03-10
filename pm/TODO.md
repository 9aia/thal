---
description: Tasks and items for the release.
---

# TODO

## 0.1.0-7

- Block unsafe sending messages. Provide feedback indicating that the message is not allowed, and allow users to edit or remove the unsafe message before sending a new one.
- Block unsafe receiving messages. Provide feedback indicating that the message is not allowed, and allow users to request a safer regeneration from the model.
- Restrict character creation and editing based on Gemini safety. Provide feedback and allow users to revise their content.
  - Add a link to the community guidelines (in the Terms) in the "Character Builder," chats, and settings.

- Rename Persona table to Character
- Store character data in English in the database while keeping the user's normal content visible in the drawer.
- Add an option to translate character data on the Discover page or in the character details drawer.

- Update the Terms and Privacy Policy:
  - Include community guidelines (covering character management and messaging).
  - Clarify pricing changes and inform users that they can cancel anytime before the trial ends to avoid charges.
  - Require users to re-accept the Privacy Policy or Terms when updated.
- Pre-create and refine default characters.
- Improve the design system.
- Update What's New
- Update the README.
- Translate all content using Psitta, with manual improvements to translations.
- Set the GCP OAuth screen to production instead of testing (requires app verification).
- Set Stripe to production instead of testing.
