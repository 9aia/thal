# TODO

## Current Tasks

- [x] Replace "delete account" to "deactivate account"
- [x] Reactivate account when re-sign-in
- [ ] Hide deactivated account

---

- Revise looking for missing implementation of:
  - Mutation toast errors
  - Mutation loading
  - Query error fallback
  - Query loading fallback
  - Array data pagination
  - a11y

- Lint

## Features

- Create community guidelines
  - Add community guidelines link to the "Character Builder", chats and settings
- Add report button (open modal) to contact options
- Prevent from Prompt injection in character instructions, etc.
- Check safety of messages
- Check safety of fields
- Validate legally character on create/edit
  - Give feedback
- Add safety inflation flags and strikes
  - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period.
- ---
- Add language drawer containing UI language and translation settings
- ---
- Add "Export account data"
- ---
- Implement basic analytics to track user engagement and app performance
- Add logger
- ---
- Add date stamps in chat
- Add unread badge
- Add markdown preview in the message input

## Enhancements

- Improve brand identity
- Redesign the authentication route
  - Redesign a auth view on app/ when unauthenticated
- Improve the homepage
- Improve the "Pricing" page and set up redirects
- Move the "About" page to the Gaia website
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before)

## Bugs

- Fix bug after deleting and recreating an account, user can't rejoin the app
