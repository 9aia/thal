---
description: A prioritized list of tasks, features, and ideas for future development.
---

# Backlog

## Security

## Bugs

### High priority

- Deal with long history on translate
- Fix listening to long messages
- Handle longer contexts
- Use only name instead of name and last name
- Fix error page not showing translation

### Medium priority

- Allow users to use only one session
- Handle invalid sessions

### Low priority

- Fixed speech missing speech stop on chat route leave
- Fix DB on build pre-render

## Features

### High priority

- Add conversation starters
- Add follow up message suggestions
- Implement basic analytics to track user engagement and app performance

### Medium priority

- Add modal for checkout cancellation
- Add date to Whats New modal articles
- Remove need to sign-in to access the app?
- Create "about me" textarea in the profile page
- Add language drawer containing UI language and translation settings
- Add native language preference (eg. BR or PT)
- Add English locale preference (eg. US or UK)
- Add time zone preference
- Implement character builder and contact manager to use sidebar param, eg. `/app/?build-character=motoko`
- Add character unique voices
- Add calls
- Add a "My Characters" section/accordion in the "New Chat"
- ---
- Add pause icon button to message listen button
- Add audio pause/resume button to chat messages
- Open contact view from query
- Add chat item option "Delete chat"
- Add button to create character in the discover characters page (aside of search field)
- Add character search to new-chat view search
- Add "Delete character" and "Edit character" actions to chat header options and contact view if you're the owner
- Add query param to add contact from URL (eg. /app/chat/username?add=true and /app?add-contact=username) and others
- Add drawer search query params when opening drawers
- Add `read` status and add unread badge to chat item

### Low priority

- Add character search results to chat and contact search
- Add multiple message TTS player
- Save message input state and other fields in local storage
- Add date stamps in chat
- Add dark theme
- Add a deleted/non-existent section in contacts
- Add localized forms for feedback, etc
- Add character knowledge
- Add media messages support, such as audio and picture

## Enhancements

### High priority

- Add a welcome modal and add a link to it in the settings page
  - Remove the Home page on mobile (Welcome modal will be better)

### Medium priority

- Add social proof section to the landing page
- Inform deleted character action such as translate, using tooltip
- Improve SEO, robots.txt, meta tags, etc
- Move emails to a third-party email service like Zoho Mail, Mailjet, etc. Some of them let you set branding for outgoing emails, even if it's sent programmatically.
- Add email signature to all emails
- Fix input autofocuses on navigate

### Low priority

- Improve branding and marketing
- Add high traffic UI alert
- Pass user name to Stripe from Google account
- Save cookie for "Continue Your Access" after once logged
- Improve common error fallback to be more customizable, eg. contact fetching error
- Improve error handling
- Improve loading handling
  - Improve chat loading by rendering the skeleton on the backend and the message on the client
  - Improve chat loading and error state fallbacks
- Fix error handling in the API endpoints fetched using form
- Improve sidebar error handling using `AsyncComponentOptions.onError`
- Hide contact list and discover search (or other search fields) when there are no results like in the chat list
- Improve toast animations and width
- Add loading splashscreen for hydration, data loading, etc

## Changes

## Glitches

### Low priority

- Fix locale change animation glitch
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
- Improve policy content
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

### Low priority

- Reduce the bundle size with valibot
- Optimize invalidations (use queryClient.setQueryData)
- Skip categorization on discoverability change
- Implement infinite scrolls
- Paginate contact and chat search
- Implement `<NuxtImg>`
- Improve data fetching (specially waterfalls)
- Create a lazy sidebar for the right sidebar similar to the left sidebar
- Clean up current playing message on message stop
- Pregenerate site pages

## Design

### Medium priority

- Add setting item type for modal openers
- Improve scroll look and feel

### Low priority

- Add respective loading states for sidebar (using the skeletons) and respective headers for each view
- Add custom payment pages

## DX

### High priority

- Fix https://github.com/drizzle-team/drizzle-orm/issues/4640

### Medium priority

- Refactor translate endpoint into `/api/message/translate` with `messageId` param
- Refactor synthesizeSpeech endpoint into `/api/message/synthesize-speech` with `messageId` param
- Refactor right sidebar into its own sidebar like the left sidebar
- Improve logging
- Add auto-migration for the database on deploy

### Low priority

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
  - Pass IS_CODESHARE env var to nuxt devserver and fix sign-in redirect
- Fix codeshare perms
- Fix codeshare checking of multiple co-authors already included in the commit message
- Migrate to Vue Vapor when it's ready
- Organize composables into folders
