---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

## Bugs

### High priority

### Medium priority

- Allow users to use only one session
- Handle invalid sessions

### Low priority

- Fixed speech missing speech stop on chat route leave
- Fix DB on build pre-render

## Features

### High priority

### Medium priority

- Add `read` status
- Add a system character for creating/editing/finding characters
- Add date to Whats New modal articles
- Remove need to sign-in to access the app
- Create "about me" textarea in the profile page
- Add locale and language configuration
  - Add native language preference (eg. BR or PT)
  - Add English locale preference (eg. US or UK)
  - Add time zone preference
- Handle better the error retry and loading states on subscription query
- Add a "My Characters" section/accordion in the "New Chat"
- Add audio pause/resume button to chat messages
- Implement character builder and contact manager to use sidebar param, eg. `/app/?build-character=motoko`
- Open contact view from query
- Add query param to add contact from URL (eg. /app/chat/username?add=true and /app?add-contact=username) and others

### Low priority

- Add curated characters
- Add character memory
- Add drawer search query params when opening drawers
- Add chat item option "Delete chat"
- Add "Unread" chat item option
- Find a way to use the Thal app for free for selected users
- Add button to create character in the discover characters page (aside of search field)
- Add search to "My Characters"
- Allow users to search for characters in the chat list, "New Chat" search results
- Add multiple message TTS player
- Save message input state and other fields in local storage
- Add dark theme
- Add date stamps in chat
- Add a deleted/non-existent section in contacts
- Allow users to send audios
- Allow characters to send audios
- Add calls
- Add localized forms for feedback, etc

## Enhancements

### High priority

### Medium priority

- Rethink welcome modal
- Add a link to welcome modal in the settings page
- Add social proof section to the landing page
- Move emails to a third-party email service like Zoho Mail, Mailjet, etc. Some of them let you set branding for outgoing emails, even if it's sent programmatically.
- Add email signature to all emails

### Low priority

- Fix input autofocuses on navigate
- Allow to save character in the character builder
- Let users click on AI feature actions and receive feedback if they can't use them because of the subscription status, but save it locally to be used later after they subscribe
- Improve branding and marketing
- Inform deleted character action such as translate, using tooltip
- Add high traffic UI alert
- Hide contact list and discover search (or other search fields) when there are no results like in the chat list
- Pass user name to Stripe from Google account
- Improve toast animations and width
- Improve error handling
  - Improve common error fallback to be more customizable, eg. contact fetching error
  - Improve sidebar error handling using `AsyncComponentOptions.onError`
  - Fix error handling in the API endpoints fetched using form
- Improve loading handling
  - Add loading splashscreen for hydration, data loading, etc
  - Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks

## Changes

## Glitches

### Low priority

- Fix right sidebar overlay being open when pressing space on the left sidebar opener button after interacting with the chat header dropdown
- Fix chat bubble animation glitch
- Fix animation glitch on opening the CharacterBuilder from the chat route using the "Edit character" options for the first time
- Rewrite Daisy dropdowns using ArkUI components (should fix the closing on click on padding bug as well)
- Fix speech highlighting breaking lines
- Avoid breaking layout in chat item when last message is too long
- Replace web modal API
- Improve HTML rendering/TTS
- Handle HTML in input/messages

## Accessibility

### High priority

- Add tooltip to all actionable icons
- Add `aria-label` and `title` to all buttons (add `title` prop to Button component)

### Low priority

- Improve a11y for avatars

## Legal

### Low priority

- List open source licenses
- Add automatic informing Thal changed (specially terms or privacy) via email
- Handle Gemini safety errors
  - Provide feedback indicating that the sending message is not allowed.
  - Provide feedback indicating that the receiving message is not allowed, and allow users to request a safer regeneration from the model.
  - Provide feedback and allow users to revise their character content.
  - Add a link to the community guidelines (in the Terms) in the "Character Builder," chats, and settings.
  - Give safety feedback on fields
- Add safety inflation flags and strikes
  - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period
- Add character rating (unrated, teen, mature, everyone)

## Performance

### High priority

### Medium priority

### Low priority

- Refactor right sidebar into its own sidebar like the left sidebar
- Reduce the bundle size with valibot
- Optimize invalidations (use queryClient.setQueryData)
- Skip categorization on discoverability change
- Implement infinite scrolls with virtual scroll or pagination
- Paginate contact and chat search
- Implement `<NuxtImg>`
- Create a lazy sidebar for the right sidebar similar to the left sidebar
- Clean up current playing message on message stop
- Improve data fetching (specially waterfalls)
- Pregenerate site pages

## Design

### Low priority

- Add respective loading states for sidebar (using the skeletons) and respective headers for each view
- Add setting item type for modal openers
- Improve scroll look and feel
- Add custom payment pages

## DX

### High priority

- Fix https://github.com/drizzle-team/drizzle-orm/issues/4640
- Add auto-migration for the database on deploy

### Medium priority

- Refactor synthesizeSpeech endpoint into `/api/message/synthesize-speech` with `messageId` param?
- Improve logging
- Create a dynamic pricing page that fetches the subscription plans from the API?

### Low priority

- Implement https://code.visualstudio.com/docs/copilot/copilot-customization to improve commit messages
- Refactor ArkUI to RekaUI
- Remove unnecessary `contact` from chat table?
- Add client-side error tracking
- Refactor menu components into reusable components instead of JS array
- Refactor Link component to support icon props and rewrite all `<A>` using it
- Refactor toast
- Refactor menu (items, dropdown, etc)
- Use inferred schemas as DTOs
- Remove unused files/code
- Improve docs
  - Add docs for the difference between roadmap, changelog and "What's New"
- Add nuxt devserver to codeshare container
  - Pass IS_CODESHARE env var to nuxt devserver and fix sign-in redirect to dev.thal.9aia.com
- Fix codeshare perms
- Fix codeshare checking of multiple co-authors already included in the commit message
- Migrate to Vue Vapor when it's ready
- Organize composables into folders
