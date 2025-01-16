---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

- Verify necessity of rate-limit to Google auth callback
- Verify necessity of preventing bots

## Features

- Add English locale preference (eg. US or UK)
- Add native language preference (eg. BR or PT)
- Add date stamps in chat
- Add unread badge
- Add a deleted/non-existent section in contacts
- Add character search results to chat and contact search
- Add dark theme
- Add character rating (unrated, teen, mature, everyone)
- Add calls
- Add character unique voices
- Add character knowledge
- Add profile photos (generate or upload)
- Add chat action for deleting it

## Bugs

- Don't consider long context
- Fix scroll look and feel
- Use a single table for user and character usernames
- Fix listening to long messages
- Lower every username comparison
- Rewrite left joins using Query API
- Replace web modal API
- Check user plan in API routes that are necessary
- Allow users to use only one session
- Handle invalid sessions
- Remove <br> appearing when copying HTML into the ContentEditable
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes

## Enhancements

- Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- Save drawer/view state in URL
- ---
- Change forms to another platform that supports localization
- ---
- Add loading splashscreen for hydration, data loading, etc
- Improve a11y
- Warn Clipboard API not allowed
- ---
- Add character search to new-chat view search
- ---
- Improve stability by handling API errors gracefully
- Improve error handling
- Improve loading handling
- Update README and docs

## Performance

- Pregenerate site pages
- Improve icon loading on slow networks
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Lazy load drawers
- Implement infinite scrolls
- Paginate contact and chat search

## DX

- Normalize schema payment field names to lower camel case
- Change `Message.isBot` to boolean mode
- Unused files/functions
- Use inferred schemas as DTOs
- Move schemas to their own files
- Add nuxt devserver to codeshare container
- Improve dev contributing guide (wip and atomic commits)
- Fix codeshare perms
- Add docs about the software architecture
