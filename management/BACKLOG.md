# Backlog

Features
---

- Add moderation.
  - Add community guidelines link to the "Character Builder".
- Add a locale modal on the home page.
- Add a publish feature to make characters discoverable.
- Add a warning for renaming character usernames.
- Add "Discover Characters" modal.
  - Add category-based search for characters.
- Add character build tool based on Profile form
- Add conversation starters
- Add PT-EN translator in the chat input.
- Add suggestions in chat.
- Add tips
- Add modal "Dictionary".
  - Add conjugation table.
  - Add grammar reference tables.
- Add assistant
  - Add a help request item in the header menu (AI-driven).
  - Add settings to adjust AI helper responses.
- ---
- Stream chat messages.
- Add date stamps in chat.
- Add markdown preview in the message input.
- Add message reactions
- Add contact editing.
- Add shortcut to contacts.
- Add an invite section in contacts (when the persona doesn’t exist).
- Add activities like minigames.
- Implement basic analytics to track user engagement and app performance.
- Add logger.

---
Bugs
---

- Check user plan in API routes.
- Redirect from `/plan/expired` when your plan is not expired.
- Fix locale change routing (remove `/{locale}` from `/app`).
- Handle invalid sessions
- Fix logout not removing cookies.
- Fix bug after deleting and recreating an account, user can't rejoin the app.
- Fix "Try again" after cookie issue resolved in the database.
- Replace web modal API.
- Fix UI updates on contact username changes

---
Enhancements
---

- Improve the homepage.
- Turn "Discover Business" into a drawer route
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before).
- Move the "About" page to the NeoGaia website.
- Improve the "Pricing" page and set up redirects.
- Redesign the authentication page.
- ---
- Change forms to another platform that supports localization
- Add turnstile
- Improve message translation considering other messages
- Add "read more" to long messages
- Stream translation
- Improve stability by handling API errors gracefully.
- Improve icon loading on slow networks.
- Improve brand identity.
- Improve loading handling.
- Improve error handling.
- Improve chat load speed
- Improve "My Characters" edition action appearance

---
Dev Enhancements
---

- Add a guide for WIP commits.
- Add a guide for atomic commits.
- Add a Code of Conduct (CoC).
- Suggest extensions for developers.
- Improve dev mode session storage for the auth endpoint on the API client.
