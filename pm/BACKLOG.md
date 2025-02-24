---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

- Verify necessity of rate-limit to Google auth callback
- Verify necessity of preventing bots

## Features

- Add language drawer containing UI language and translation settings
- Set meta tags for each page
- Message/AI rate in trial instead of time
- Message/AI rate in price
- Add character unique voices
- Add English locale preference (eg. US or UK)
- Add native language preference (eg. BR or PT)
- Add config for time
- Add date stamps in chat
- Add unread badge
- Add a deleted/non-existent section in contacts
- Add character search results to chat and contact search
- Add delete character action
- Add chat action for deleting it
- Add dark theme
- Add character rating (unrated, teen, mature, everyone)
- Add media messages support
- Add calls
- Add character knowledge
- Add multiple message TTS player

## Bugs

- Lower every username comparison
- Fix listening to long messages
- Use a single table for user and character usernames
- Rewrite left joins using Query API
- Fix what's new indicator
- Fix go-to-bottom button position after chat clearing
- Fix sign-in back redirect with drawers after closing them
- Avoid breaking layout in chat item when last message is too long
- Replace web modal API
- Improve HTML rendering/TTS
- Handle HTML in input/messages
- Don't consider long context
- Fix locale change routing (remove `/{locale}` from `/app`)
  - Use locale param in site routes
- Allow users to use only one session
- Handle invalid sessions

## Enhancements

- Update meta-tags
- Translate character data
- Open chat list on mobile always
- Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- Add button to create character in the discover characters page (aside of search field)
- Save in-progress state
- Turn sign-in page into a modal
- Add confirmation modal on chat clear
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
- ---
- Add custom payment pages
- Improve scroll look and feel

## Performance

- Pregenerate site pages
- Improve icon loading on slow networks
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Lazy load drawers
- Implement infinite scrolls
- Paginate contact and chat search

## Legal

## DX

- Change `Message.isBot` to boolean mode
- Unused files/functions
- Use inferred schemas as DTOs
- Add nuxt devserver to codeshare container
- Improve dev contributing guide (commit guide)
- Fix codeshare perms
- Add docs about the software architecture
- Move schemas to their own files
