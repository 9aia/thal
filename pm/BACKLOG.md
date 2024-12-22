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
- Add news chat/route
- Add "View character details"
- Add "Keep Character definition/instructions private"
- Add language drawer containing UI language and translation settings
- ---
- Add markdown preview in the message input
- ---
- Add "Export account data"
- Add date stamps in chat
- ---
- Implement basic analytics to track user engagement and app performance
- Add logger

## Bugs

- Fix hydration errors in "Discover"
- Fix error when navigating back from the contact card
- Fix (last) message status
- Resolve the issue where the contact addition drawer fails to open on mobile devices when adding a contact directly from the chat
- Fix UI updates on contact username changes
- Use a single table for user and character usernames
- Allow users to use only one session
- Lower every username
- Rewrite left joins using Query API
- Check user plan in API routes
- Add rate-limit to Google auth callback
- Fix retrial after account deletion
- Fix bug after deleting and recreating an account, user can't rejoin the app
- Redirect from `/plan/expired` when your plan is not expired
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes
- Handle invalid sessions
- Fix logout not removing cookies
- Fix "Try again" after cookie issue resolved in the database
- Prevent bots with turnstile

## Enhancements

- Add character search results to chat and contact search
- Replace web modal API
- Change forms to another platform that supports localization
- ---
- Skip categorization on discoverability change
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
  - Unused files/functions
  - Use inferred schemas as DTOs
- Move schemas to their own files
- Normalize schema payment field names to lower camel case
- Change `Message.isBot` to boolean mode
- Clean console warnings
- Move `layers/ui` to `web/components/ui`
- Move `app/` to `web/`
- Improve dev mode session storage for the auth endpoint on the API client
- Suggest extensions for developers
- Add a guide for WIP commits
- Add a guide for atomic commits
