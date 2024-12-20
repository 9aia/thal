# Backlog

## Features

- Create community guidelines
- Add community guidelines link to the "Character Builder", chats and settings
- Add report button (open modal) to contact options
- Check safety of messages
- Check safety of fields
- Validate legally character on create
  - Give feedback
- Add safety inflation flags
- ---
- Add contact editing
- Add "View character details"
- Add "Keep Character definition/instructions private"
- Add news chat/route
- Add language drawer containing UI language and translation settings
- Add a locale modal on the home page
- Add option to copy message
- ---
- Implement basic analytics to track user engagement and app performance
- Add logger
- ---
- Add "Export account data"
- Add date stamps in chat
- ---
- Add markdown preview in the message input

## Bugs

- Allow users to use only one session
- Resolve the issue where the contact addition drawer fails to open on mobile devices when adding a contact directly from the chat
- Lower every username
- Fix (last) message status
- Rewrite left joins using Query API
- Check user plan in API routes
- Add rate-limit to Google auth callback
- Fix bug after deleting and recreating an account, user can't rejoin the app
- Redirect from `/plan/expired` when your plan is not expired
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes
- Fix UI updates on contact username changes
- Fix retrial after account deletion
- Handle invalid sessions
- Fix logout not removing cookies
- Fix "Try again" after cookie issue resolved in the database
- Prevent bots with turnstile

## Enhancements

- Add contact search
- Add chats search
- Add share button (copy link/username) to characters and contact options
- Add option to fork characters
- Add a warning for renaming character usernames
- Add a empty fallback to chats
- Improve "My Characters" edition action appearance
- Add confirmation modal on chat clear
- Inhibit narration
- Replace web modal API
- List private character from contact list in a different section
- Add a deleted/non-existent section in contacts
- Change forms to another platform that supports localization
- Add loading bar on route navigation
- ---
- Skip categorization on visibility change
- Stream translation
- Improve search performance
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Improve icon loading on slow networks
- ---
- Improve stability by handling API errors gracefully
- Improve error handling
- Improve loading handling
- ---
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before)
- Redesign the authentication route
  - Redesign a auth view on app/ when unauthenticated
- Improve the homepage
- Improve the "Pricing" page and set up redirects
- Move the "About" page to the NeoGaia website
- Improve brand identity
- Add dark theme
- ---
- Add profile photos (generate or upload)

## Dev Enhancements

- Remove unused code
- Suggest extensions for developers
- Add a guide for WIP commits
- Add a guide for atomic commits
- Improve dev mode session storage for the auth endpoint on the API client
