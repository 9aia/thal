# Backlog

Features
---

- Add moderation.
  - Add community guidelines link to the "Character Builder".
- Implement basic analytics to track user engagement and app performance.
- Add logger.
- Add a locale modal on the home page.

### Character
- Add a publish feature to make characters discoverable.
- Add a warning for renaming character usernames.
- Add "Discover Characters" modal.
  - Add category-based search for characters.

### Chat
- Add PT-EN translator in the chat input.
- Add conversation starters
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
- Add activities like minigames.
- Add markdown preview in the message input.
- Add message reactions

### Contact
- Add contact editing.
- Add shortcut to contacts.
- Add an invite section in contacts (when the persona doesn’t exist).

---
Bugs
---

### General
- Replace web modal API.

### Payments
- Check user plan in API routes.
- Redirect from `/plan/expired` when your plan is not expired.

### Localization
- Fix locale change routing (remove `/{locale}` from `/app`).

### Auth
- Handle invalid sessions
- Fix logout not removing cookies.
- Fix bug after deleting and recreating an account, user can't rejoin the app.
- Fix "Try again" after cookie issue resolved in the database.

---
Enhancements
---

### General
- Improve stability by handling API errors gracefully.
- Improve icon loading on slow networks.
- Improve loading handling.
- Improve error handling.
- Improve brand identity.
- Add turnstile
- Change forms to another platform that supports localization

### Profile
- Improve profile design using right drawer

### Chat
- Improve chat load speed
- Improve message translation considering other messages
- Stream translation
- Add "read more" to long messages

### Characters
- Turn "Discover Business" into a drawer route
- Improve "My Characters" edition action appearance

### Legal
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before).

### Auth
- Redesign the authentication page.

### Website
- Improve the homepage.
- Move the "About" page to the NeoGaia website.
- Improve the "Pricing" page and set up redirects.

---
Dev Enhancements
---

- Remove used code
- Add a guide for WIP commits.
- Add a guide for atomic commits.
- Add a Code of Conduct (CoC).
- Suggest extensions for developers.
- Improve dev mode session storage for the auth endpoint on the API client.
