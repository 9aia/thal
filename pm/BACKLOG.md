---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

## Bugs

High priority:

- Deal with long history on translate
- Fix listening to long messages
- Handle longer contexts
- Rewrite left joins using Query API
- Allow users to use only one session
- Handle invalid sessions
- Use only name instead of name and last name

Medium priority:
- Add respective loading states for sidebar (using the skeletons) and respective headers for each view

Low priority:

- Fix DB on build pre-render

## Features

- Create "about me" textarea in the profile page
- Add audio pause/resume button to chat messages
- Add a "My Characters" section/accordion in the "New Chat"
- Implement basic analytics to track user engagement and app performance
- Implement soft-deletes for characters to enable translation/listening in chats with deleted characters
- Add rate limit details to the pricing page
- Add language drawer containing UI language and translation settings
- Add English locale preference (eg. US or UK)
- Add native language preference (eg. BR or PT)
- Add config for time
- Add character unique voices
- Add pause icon button to message listen button
- ---
- Add chat item option "Delete chat"
- Add "Create another character" button for faster multiple creation on preview env
- Add button to create character in the discover characters page (aside of search field)
- Add character search to new-chat view search
- Add "Delete character" and "Edit character" actions to chat header options and contact view if you're the owner
- Add query param to add contact from URL (eg. /app/chat/username?add=true and /app?add-contact=username) and others
- ---
- Save message input state and other fields in local storage
- Add date stamps in chat
- Add dark theme
- Add a deleted/non-existent section in contacts
- Add character search results to chat and contact search
- Add drawer search query params when opening drawers
- Add multiple message TTS player
- Add character knowledge
- Add media messages support, such as audio and picture

Medium priority:

- Add calls

Low priority:

- Add `read` status and add unread badge to chat item

## Enhancements

- Set meta tags for each page
- Fix input autofocuses on navigate
- Apply slide-right animations to settings routes
- Inform deleted character action such as translate, using tooltip
- Save cookie for "Continue Your Access" after once logged
- Pass user name to Stripe from Google account
- Hide contact list and discover search (or other search fields) when there are no results like in the chat list

Low priority:

- Improve toast animations and width
- Add loading splashscreen for hydration, data loading, etc
- Improve error handling
- Improve loading handling
  - Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- Fix error handling in the API endpoints fetched using form
- Improve sidebar error handling using `AsyncComponentOptions.onError`

---

## Changes

## Glitches

Low priority:

- Fix animation glitch on opening the CharacterBuilder from the chat route using the "Edit character" options
- Rewrite Daisy dropdowns using ArkUI components (should fix the closing on click on padding bug as well)
- Fix speech highlighting breaking lines
- Fix emoji color rendering in translations
- Add a guard to checkout cancel page when the user hasn't actually canceled
- Avoid breaking layout in chat item when last message is too long
- Replace web modal API
- Improve HTML rendering/TTS
- Handle HTML in input/messages

## Accessibility

Low priority:

- Add `aria-label` and `title` to all buttons (add `title` prop to Button component)
- Add tooltip to all actionable icons
- Improve a11y for avatars

## Legal

Low priority:

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

## Performance

Low priority:

- Optimize invalidations (use queryClient.setQueryData)
- Implement `<NuxtImg>`
- Clean up current playing message on message stop
- Pregenerate site pages
- Skip categorization on discoverability change
- Implement infinite scrolls
- Improve data fetching (specially waterfalls)
- Paginate contact and chat search
- Create a lazy sidebar for the right sidebar similar to the left sidebar

## Design

Medium priority:

- Add setting item type for modal openers
- Improve scroll look and feel

Low priority:

- Add custom payment pages

## DX

Low priority:

- Add auto-migration for the database on deploy
- Improve logging
- Add client-side error tracking
- Change forms to another platform that supports localization
- Remove unused files/code
- Use inferred schemas as DTOs
- Refactor drawers
- Refactor menu components into reusable components instead of JS array
- Refactor Link component to support icon props and rewrite all `<A>` using it
- Refactor toast
- Refactor menu (items, dropdown, etc)
- Improve docs
  - Add docs for the difference between roadmap, changelog and "What's New"
- Add nuxt devserver to codeshare container
  - Pass IS_CODESHARE env var to nuxt devserver and fix sign-in redirect
- Fix codeshare perms
- Fix codeshare checking of multiple co-authors already included in the commit message
