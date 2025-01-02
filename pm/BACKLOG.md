# Backlog (Current Version)

## Features

- [ ] Create community guidelines
  - [ ] Add community guidelines link to the "Character Builder", chats and settings
- [ ] Add report button (open modal) to contact options
- [ ] Prevent from Prompt injection in character instructions, etc.
- [ ] Check safety of messages
- [ ] Check safety of fields
- [ ] Validate legally character on create/edit
  - [ ] Give feedback
- [ ] Add safety inflation flags and strikes
  - [ ] Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period.
- ---
- [ ] Add "What's New" modal
- [ ] Add onboarding
- [ ] ---
- [ ] Add language drawer containing UI language and translation settings
- ---
- [ ] Add markdown preview in the message input
- ---
- [ ] Add "Export account data"
- [ ] Add date stamps in chat
- ---
- [ ] Implement basic analytics to track user engagement and app performance
- [ ] Add logger
- [ ] ---
- [ ] Add unread badge

## Bugs

- [ ] Fix modal opening on mobile
- [ ] Fix drag scroller on mobile
- [ ] Fix bug copying HTML in messages
- [ ] Rewrite left joins using Query API
- [ ] Check user plan in API routes that are necessary
- [ ] Prevent bots with turnstile
- [ ] Fix hydration errors
- [ ] Implement chat search by character name
- [ ] Redirect from `/plan/expired` when your plan is not expired
- [ ] Fix locale change routing (remove `/{locale}` from `/app`)
  - [ ] Use locale param in site routes
---
- [ ] Add rate-limit to Google auth callback
- [ ] Use a single table for user and character usernames
- [ ] Allow users to use only one session
- [ ] Lower every username comparison
- [ ] Fix retrial after account deletion
- [ ] Fix bug after deleting and recreating an account, user can't rejoin the app
- [ ] Handle invalid sessions
- [ ] Fix logout not removing cookies
- [ ] Fix "Try again" after cookie issue resolved in the database

## Enhancements

- [ ] Save drawer/view state in URL
- [ ] Add option to copy message
- [ ] Improve "My Characters" edition action appearance
- [ ] Add a warning for renaming character usernames
- [ ] Focus on inputs after opening drawers
- [ ] Add hydration loading indicator
- ---
- [ ] Replace web modal API
- [ ] Change forms to another platform that supports localization
- ---
- [ ] Improve stability by handling API errors gracefully
- [ ] Improve error handling
- [ ] Improve loading handling
- ---
- [ ] Improve brand identity
- [ ] Add dark theme
- [ ] Add privacy info about account deletion (cannot delete before month ends, but users can delete manually before)
- [ ] Redesign the authentication route
  - [ ] Redesign a auth view on app/ when unauthenticated
- [ ] Improve the homepage
- [ ] Improve the "Pricing" page and set up redirects
- [ ] Move the "About" page to the Gaia website
---
- [ ] Support multiple user message on offline

- [ ] Improve `package.json`
- [ ] Improve `README.md`
- [ ] Add security file
- [ ] Add license file
- [ ] Config GitHub repository metadata

## Performance Enhancements

- [ ] Pregenerate site pages
- [ ] Skip categorization on discoverability change
- [ ] Improve route loading speed, especially "Chats" and "Discover Characters"
- [ ] Improve icon loading on slow networks
- [ ] Implement infinite scrolls
- [ ] Improve contact and chat search query performance
- [ ] Paginate contact and chat search

## Dev Enhancements

- [ ] Clean console warnings
- [ ] Remove unused code
  - [ ] Unused files/functions
  - [ ] Use inferred schemas as DTOs
  - [ ] Remove profile details features for now
- [ ] Move schemas to their own files
- [ ] Move `app/` to `web/`
- [ ] Move `layers/ui` to `web/components/ui`
- [ ] Normalize schema payment field names to lower camel case
- [ ] Change `Message.isBot` to boolean mode
- [ ] Add nuxt devserver to codeshare container
- [ ] Improve contributing guide
  - [ ] Add a guide for WIP commits
  - [ ] Add a guide for atomic commits
- [ ] Update GCP metadata
