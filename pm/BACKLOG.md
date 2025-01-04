# Backlog (Current Version)

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

## Bugs

- Fix bug copying HTML in messages
- Check user plan in API routes that are necessary
- Prevent bots with turnstile
- Rewrite left joins using Query API
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes
---
- Add rate-limit to Google auth callback
- Allow users to use only one session
- Handle invalid sessions
- Fix logout not removing cookies
- Fix retrial after account deletion
- Fix bug after deleting and recreating an account, user can't rejoin the app
- Use a single table for user and character usernames
- Lower every username comparison
---
- Fix "Try again" after cookie issue resolved in the database

## Enhancements

- Add option to copy message
- ---
- Change forms to another platform that supports localization
- ---
- Improve stability by handling API errors gracefully
- Improve error handling
- Improve loading handling
- ---
- Replace web modal API
- ---
- Improve brand identity
- Add dark theme
- Redesign the authentication route
  - Redesign a auth view on app/ when unauthenticated
- Improve the homepage
- Improve the "Pricing" page and set up redirects
- Move the "About" page to the Gaia website
- Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before)
- ---
- Add hydration loading indicator
- Improve a11y
- Warn Clipboard API not allowed
- ---
- Add character search to new-chat view search
- ---
- Improve `package.json`
- Improve `README.md`
- Config GitHub repository metadata
- Update GCP metadata

## Performance Enhancements

- Pregenerate site pages
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Improve icon loading on slow networks
- Implement infinite scrolls
- Paginate contact and chat search

## Dev Enhancements

- Remove unused code
  - Unused files/functions
  - Use inferred schemas as DTOs
  - Remove profile details features for now
- Move schemas to their own files
- Normalize schema payment field names to lower camel case
- Change `Message.isBot` to boolean mode
- Add nuxt devserver to codeshare container
- Improve dev contributing guide (wip and atomic commits)
