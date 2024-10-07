# Backlog

Features
---

### General
- Add moderation.
- Implement basic analytics to track user engagement and app performance.
- Add logger.

### Settings
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
- Show the last message in the chat.
- Stream chat messages.
- Add a help request item in the header menu (AI-driven).
- Add PT-EN translator in the chat input.
- Add modal "Dictionary".
  - Add conjugation table.
- Add option "Translate" to messages.
- Add grammar reference tables.
- Add suggestions/tips in chat.
- Add date stamps in chat.
- Add activities like minigames.
- Add markdown preview in the message input.

---
Enhancements
---

### General
- Improve stability by handling API errors gracefully.
- Improve icon loading on slow networks.
- Improve loading handling.
- Improve error handling.
- Improve brand identity.

### Chat
- Add a GenAI experimental disclaimer note at the top of the chat.

### Legal
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before).

### Auth
- Redesign the authentication page.

### Website
- Improve the homepage.
- Move the "About" page to the NeoGaia website.
- Improve the "Pricing" page and set up redirects.

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
- Fix logout not removing cookies.
- Fix bug after deleting and recreating an account, user can't rejoin the app.
- Fix "Try again" after cookie issue resolved in the database.

---
Dev Enhancements
---

- Add a guide for WIP commits.
- Add a guide for atomic commits.
- Add a Code of Conduct (CoC).
- Suggest extensions for developers.
- Improve dev mode session storage for the auth endpoint on the API client.
