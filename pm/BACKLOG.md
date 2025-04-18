---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

- Verify necessity of rate-limit to Google auth callback
- Verify necessity of preventing bots

## Features

- Implement basic analytics to track user engagement and app performance
- Add language drawer containing UI language and translation settings
- Message/AI rate in trial instead of time
- Message/AI rate in price
- Add character unique voices
- Add English locale preference (eg. US or UK)
- Add native language preference (eg. BR or PT)
- Add config for time
- Add a deleted/non-existent section in contacts
- Add character search results to chat and contact search
- Add delete character action
- Add chat item option "Mark as unread", "Delete chat"
- Add date stamps in chat
- Add dark theme
- Add unread badge
- Add multiple message TTS player
- Add character knowledge
- Add media messages support, such as audio and picture
- Add calls

## Bugs

- Fix DB on build pre-render
- Lower every username comparison
- Use a single table for user and character usernames
- Fix listening to long messages
- Rewrite left joins using Query API
- Fix what's new indicator
- Fix go-to-bottom button position after chat clearing
- Fix sign-in back redirect with drawers after closing them
- Avoid breaking layout in chat item when last message is too long
- Handle longer contexts
- Fix locale change routing (remove `/{locale}` from `/app`), but keep locale param in site routes
- Allow users to use only one session
- Handle invalid sessions
- Warn Clipboard API not allowed
- Replace web modal API
- Improve HTML rendering/TTS
- Handle HTML in input/messages

## Enhancements

- Add discover search param
- Improve DB column sizes
- Set meta tags for each page
- Save cookie for "Continue Your Access" after once logged
- Pass user name to Stripe from Google account
- Create a custom 500 page for DB or critical errors instead of Nuxt default 500 page
- Open chat list on mobile always
- Add button to create character in the discover characters page (aside of search field)
- Save in-progress state
- Turn sign-in page into a modal
- Add confirmation modal on chat clear
- Add character search to new-chat view search
- ---
- Add loading splashscreen for hydration, data loading, etc
- ---
- Improve a11y
- Improve error handling
- Improve loading handling
  - Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- Update docs
- ---
- Change forms to another platform that supports localization
- Add custom payment pages
- Improve scroll look and feel

## Performance

- Deal with long history on translate
- Clean up current playing message on message stop
- Pregenerate site pages
- Improve icon loading on slow networks
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats" and "Discover Characters"
- Lazy load drawers
- Implement infinite scrolls
- Paginate contact and chat search

## Legal

- Handle Gemini safety errors
  - Provide feedback indicating that the sending message is not allowed.
  - Provide feedback indicating that the receiving message is not allowed, and allow users to request a safer regeneration from the model.
  - Provide feedback and allow users to revise their character content.
  - Add a link to the community guidelines (in the Terms) in the "Character Builder," chats, and settings.
  - Give safety feedback on fields
- Add safety inflation flags and strikes
  - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period
- Add character rating (unrated, teen, mature, everyone)
- Inform Thal changed (specially terms or privacy)

## DX

- Improve logging
- Change `Message.isBot` to boolean mode
- Remove unused files/code
- Use inferred schemas as DTOs
- Add nuxt devserver to codeshare container
- Fix codeshare perms
- Improve docs
  - Improve dev contributing guide (commit guide)
  - Add docs for the difference between roadmap, changelog and "What's New"
- Move schemas to their own files
