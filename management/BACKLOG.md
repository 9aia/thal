# Backlog

Features
---

- Add moderation.
- Implement basic analytics to track user engagement and app performance.
- Add logger.

- Add settings to adjust AI helper responses.

### Localization
- Add a locale modal on the home page.

### Payment
- Add "Connected with Stripe" info on the subscription settings page.

### Character
- Add community guidelines link to the "Character Builder".
- Add a publish feature to make characters discoverable.
- Add a warning for renaming character usernames.
- Add category-based search for characters.
- Add "Discover Personas" modal.

### Contact
- Add contact editing.
- Add shortcut to contacts.
- Add an invite section in contacts (when the persona doesn’t exist).

### Chat
- Stream chat messages.
- Add a help request item in the header menu (AI-driven).
- Add PT-EN translator in the chat input.
- Add modal "Dictionary".
  - Add conjugation table.
- Add grammar reference tables.
- Add suggestions/tips in chat.
- Add date stamps in chat.
- Add activities like minigames.
- Add markdown preview in the message input.
- Add message reactions

---
Bugs
---

### General
- Replace web modal API.

### My Characters
- Improve back navigation

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

### Chat
- Improve chat load speed
- Improve message translation considering other messages
- Stream translation

### Characters
- Improve "My Characters" edition action appearance
- Turn "Discover Business" into a drawer route

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

- Add a guide for WIP commits.
- Add a guide for atomic commits.
- Add a Code of Conduct (CoC).
- Suggest extensions for developers.
- Improve dev mode session storage for the auth endpoint on the API client.
