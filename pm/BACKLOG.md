# Backlog

- Revise looking for missing implementation of:
  - Mutation toast errors
  - Mutation loading
  - Query error fallback
  - Query loading fallback
  - Array data pagination
  - a11y

## Features

- Add unread badge
- Add dark theme

## Security

- Verify necessity of rate-limit to Google auth callback
- Verify necessity of preventing bots

## Bugs

- Check user plan in API routes that are necessary
- Fix bug copying HTML in messages
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes
---
- Allow users to use only one session
- Handle invalid sessions
- Fix retrial after account deletion
- Use a single table for user and character usernames
- Lower every username comparison
---
- Fix "Try again" after cookie issue resolved in the database
---
- Replace web modal API

## Enhancements

- Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- ---
- Change forms to another platform that supports localization
- ---
- Improve stability by handling API errors gracefully
- Improve error handling
- Improve loading handling
- ---
- Add loading splashscreen for hydration, data loading, etc
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
- Improve icon loading on slow networks
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Lazy load drawers
- Implement infinite scrolls
- Paginate contact and chat search

## Dev Enhancements

- Normalize schema payment field names to lower camel case
- Change `Message.isBot` to boolean mode
- Unused files/functions
- Use inferred schemas as DTOs
- Move schemas to their own files
- Add nuxt devserver to codeshare container
- Improve dev contributing guide (wip and atomic commits)
- Fix codeshare perms
