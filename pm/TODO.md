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
- Give safety feedback on character create/edit
- Give safety feedback on message send/receive
- Give safety feedback on fields
- Prevent from Prompt injection in character instructions, etc.
- Add safety inflation flags and strikes
  - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period.
- ---
- Add language drawer containing UI language and translation settings
- ---
- Add "about me" textarea in profile to help AI generate message suggestions
- Add message suggestion generator with a input to prompt (useful for generating from an idea)
- Add next message suggestions (2-4 options)
- Add message option "Listen to"
- Improve prompt to chats be more conversational/chat-like
- ---
- Implement basic analytics to track user engagement and app performance
- Add logger
- ---
- Add date stamps in chat
- Add markdown preview in the message input

## Enhancements

- Add option to copy message
---
- Improve brand identity
- Redesign the authentication route
  - Redesign a auth view on app/ when unauthenticated
- Improve the homepage
- Improve the "Pricing" page and set up redirects
- Move the "About" page to the Gaia website
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before)

## Bugs

- Rewrite left joins using Query API
