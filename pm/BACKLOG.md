---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

## Features

- Move Pronouns field into About me textarea
- Add a "My Characters" section/accordion in the "New Chat"
- Implement basic analytics to track user engagement and app performance
- Implement soft-deletes for characters to enable translation/listening in chats with deleted characters
- Add rate limit details to the pricing page
- Add language drawer containing UI language and translation settings
- Add English locale preference (eg. US or UK)
- Add native language preference (eg. BR or PT)
- Add config for time
- Add character unique voices
- Add delete character action
- Add chat item option "Mark as unread", "Delete chat"
- Add dark theme
- Add date stamps in chat
- Add query param to add contact from URL (eg. /app/chat/username?add=true and /app?add-contact=username) and others
- Add a deleted/non-existent section in contacts
- Add character search results to chat and contact search
- Add multiple message TTS player
- Add unread badge
- Add character knowledge
- Add media messages support, such as audio and picture
- Add calls

## Bugs

- Drawer isn't opening in front of all drawers after it's already open behind them
- Rewrite Daisy dropdowns using ArkUI components (should fix the closing on click on padding bug as well)
- Add drawer search query params when opening drawers
- Fix input autofocuses on navigate
- Fix go-to-bottom button position after chat clearing
- Lower every username comparison
- Fix listening to long messages
- Rewrite left joins using Query API
- Fix DB on build pre-render
- Avoid breaking layout in chat item when last message is too long
- Handle longer contexts
- Fix locale change routing (remove `/{locale}` from `/app`), but keep locale param in site routes
- Allow users to use only one session
- Handle invalid sessions
- Warn Clipboard API not allowed
- Improve HTML rendering/TTS
- Handle HTML in input/messages
- Replace web modal API
- Use only name instead of name and last name

## Enhancements

- Improve discover page layout (search should be on top fixed)
- Add empty contact list fallback
- Add "Create another character" button for faster multiple creation on preview env
- Inform deleted character action such as translate, using tooltip
- Add discover search param
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
  - Improve a11y for avatars
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
- Skip categorization on discoverability change
- Improve route loading speed, especially "Chats"
- Implement infinite scrolls
- Paginate contact and chat search
- Lazy load drawers

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

- Rename username in the usernames table to text
- Refactor toast
- Refactor menu (items, dropdown, etc)
- Improve logging
- Remove unused files/code
- Use inferred schemas as DTOs
- Improve docs
  - Add docs for the difference between roadmap, changelog and "What's New"
- Add nuxt devserver to codeshare container
- Fix codeshare perms
