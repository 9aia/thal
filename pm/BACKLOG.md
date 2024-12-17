# Backlog

Features
---

- Fork characters
- Allow users to invalidate all sessions
- Add moderation.
  - Create community guidelines
  - Add community guidelines link to the "Character Builder".
  - Validate character on create
    - Give feedback
  - Add report button (open modal) to contact options
  - Check safety of messages
  - Check safety of fields
- Add "Discover Characters" modal.
  - Add category-based search for characters.
  - Search by name.
- Add character builder
  - Add "Keep Character definition/instructions private"
  - Add a warning for renaming character usernames.
- Add chat utilities
  - Add conversation starters.
  - Add PT-EN translator in the chat input.
  - Add suggestions in chat.
  - Add tips
  - Add modal "Dictionary".
    - Add conjugation table.
    - Add grammar reference tables.
- Add assistant
  - Add a help request item in the header menu (AI-driven).
  - Add settings to adjust AI helper responses.
- Add news chat
- Add language drawer containing UI language and translation settings
- Add a locale modal on the home page.
- ---
- Add generative character building by prompt.
  - Add field to prompt.
  - Add "Suprise me" to fill in the prompt.
- Improve custom character building tab
  - Add "generate" option to each field
- Add character build tool based on Profile form.
- Add bot father to create characters
- ---
- Add an invite section in contacts (when the persona doesn’t exist).
- Add shortcut to contacts.
- Add contact editing.
- Implement basic analytics to track user engagement and app performance.
- Add logger.
- Stream chat messages.
- Add date stamps in chat.
- Add message reactions
- ---
- Add markdown preview in the message input.
- Add activities like minigames.
- Add "Export account data"
- Add "View character details"

---
Bugs
---

- Lower every username
- Fix retrial after account deletion
- Fix bug after deleting and recreating an account, user can't rejoin the app.
- Rewrite left joins using Query API
- Fix (last) message status
- Fix UI updates on contact username changes
- Check user plan in API routes.
- Redirect from `/plan/expired` when your plan is not expired.
- Fix locale change routing (remove `/{locale}` from `/app`).
- Handle invalid sessions
- Fix logout not removing cookies.
- Fix "Try again" after cookie issue resolved in the database.
- Replace web modal API.

---
Enhancements
---

- Inhibit narration
- Add confirmation modal on chat clear
- Add contact search
- Add contact QR code
- List private character from contact list in a different section
- Skip categorization on visibility change
- Improve search performance
- Add rate-limit to Google auth callback
- Add a empty fallback to chats
- Improve the homepage.
- Turn "Discover Business" into a drawer route
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before).
- Move the "About" page to the NeoGaia website.
- Improve the "Pricing" page and set up redirects.
- Redesign the authentication page.
- Add share button (copy link/username) to contact options
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

- Remove unused code
- Add a guide for WIP commits.
- Add a guide for atomic commits.
- Add a Code of Conduct (CoC).
- Suggest extensions for developers.
- Improve dev mode session storage for the auth endpoint on the API client.
