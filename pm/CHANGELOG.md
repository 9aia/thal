---
description: A detailed, chronological record of all changes made to a project, often including technical information.
---

# Changelog

## [Unreleased]

### Added

- Added option to discard character draft
- Added edit action on character chat header if you are the owner
- Added prompt to build character based on search query
- Added go to character chat on character edition

### Fixed

- Improved button icons
- Fixed infinite loading on generate button in character builder
- Fixed SQL Constraint error on character deletion

### Enhancements

- Improved character builder prompt

## [0.1.0-9] - 2025-05-25

### Fixed

- Added rate limit for various endpoints
- Fixed draft available status code
- Fixed discover search
- Prevent user from creating an character draft without prompt
- Fixed reactivity for display names when deleting a contact
- Fixed incorrect display names for discover characters
- Fixed waving hand icon
- Fixed missing send message button
- Fixed update contact with new info in contact drawer
- Added support for redirecting to URLs containing query parameters
- Unified contact and character usernames
- Improved button icons
- Added validation for character draft generation
- Improved character draft error handling

### Performance

- Improved message history performance

### Removed

- Removed username from "Discover Characters" items

## [0.1.0-8] - 2025-05-05

### Added

- Added character data localization

### Enhancements

- Improved contact view drawer width
- Improved user request on the "Character deletion" modal
- Improved icons
- Improved icon buttons
- Moved to right the copy username action on "Discover Characters" items
- Improved translation prompting

### Fixed

- Fixed category name translation on "My Characters" and "Discover Characters" items
- Fixed useRoute warning when changing language
- Improved translation context awareness
- Fixed username matching on the "Character deletion" modal
- Fixed "Not a contact" card horizontal padding
- Allowed adding contact of deleted characters
- Disabled option to translate messages from deleted characters
- Allowed viewing chat history for deleted characters
- Fixed character data query invalidation using locale
- Fixed chat navigation in approval "message" action
- Improved character display name on chat item
- Fixed character display and avatar name on "Contact Info"
- Fixed icon loading fallback
- Fixed landpage pricing icon
- Fixed username copy action on discover character item

## [0.1.0-7] - 2025-04-01

### Added

- Added effective date to policy pages
- Added drafts and approvals for character generation with safety
- Added Gemini model environment variable

### Changed

- Changed character building to prompting

### Fixed

- Prevented showing non-public characters on the "Discover Characters" page
- Fixed incorrect handling for chat ID in first local chat
- Fixed message input placeholder translation
- Fixed autofocus of the character builder prompt field
- Fixed missing last message query invalidation on message edit
- Updated to Gemini 2.0 Flash Lite
- Fixed "My Characters" item dropdown positioning
- Added delete action to messages when there is a error
- Added edit action to messages when there is a error
- Fixed message input emptiness check
- Improved button loading spinner size
- Improved What's New article titles
- Improved Gemini error messages and handling

## [0.1.0-6] - 2025-03-09

### Features

- Added overdue subscription app notes

### Fixed

- Fixed empty message checking before sending
- Added custom CTAs based on payment status
- Fixed homepage hero padding bottom
- Fixed multiple message listening by interrupting the previous message
- Fixed infinite scroll issue on the "Discover Characters" page
- Fixed welcome app note behavior to remove cookie once seen
- Disabled "Build Character" form when subscription has overdue
- Deactivated character management and message sending when subscription has overdue
- Redirected to pricing page when subscription has canceled
- Fixed "My Characters" item click propagation

### Changed

- Set message time zone to America/Sao_Paulo
- Improved content
- Improved payment pages
- Animated category selection in CharacterList
- Improved content of the overdue subscription modal

### Performance

- Changed DB plan type to int
- Merged pricing query with checkout status query

### DX

- Changed DB `freeTrialUsed` to boolean mode
- Normalized schema payment field names to lower camel case
- Refactored to use subscription events only

## [0.1.0-5] - 2025-02-20

### Fixed

- Fixed drawer scroll
- Fixed welcome route layout
- Fixed contact link on plan pending route
- Prevented unintented input focus on modifier keys
- Fixed sign-in back redirects
- Added prefix to new character generator utilities

### Added

- Added markdown rendering to messages

### Changed

- Removed extraneous non-props attributes on AccountSettingsForm

## [0.1.0-4] - 2025-02-17

### Added

- Added character creation button to the bottom of the Discover Characters page
- Added Discover Characters link to the chat list header
- Added URL shortcuts for drawers
- Added overdue plan modal

### Changed

- Moved worker to Gaia account
- Moved database to Gaia account
- Moved domain to Gaia domain

### Fixed

- Fixed spacing and breakline encoding
- Fixed D1 binding on production
- Read app URL from cloudflare request

## [0.1.0-3] - 2025-02-10

### Changed

- Improved SEO

### Fixed

- Avoided to open chat list as default on mobile
- Prevented zoom on mobile
- Changed character sharing to use URL on chat header options
- Improved Pricing translation
- Implemented chat drawer closing on character message toast action
- Fixed auto capitalize on username inputs on mobile

### Added

- Added preview alert

## [0.1.0-2] - 2025-02-09

### Changed

- Retrieved and display plan price from Stripe
- Improved pages layout
- Improved page titles
- Improved translations
- Improved chat prompt

### Fixed

- Implemented query invalidation in "Discover characters"

## [0.1.0-1] - 2025-02-08

### Fixed

- Fixed environment variables not being loaded in production
- Changed build preset to cloudflare-modules

## [0.1.0-0] - 2025-02-05

### Added

- Integrated sign-in via Google
- Added account management features: logout and deactivate account
- Integrated subscription management
- Added profile management: set name, last name, username, and pronouns
- Implemented language configuration for UI
- Added "Discover characters" feature:
  - List and search character by name
  - List, search, and filter characters by category
  - Display category badges on characters
  - Modal to list all categories and filter by them
- Added Character Management:
  - Create, view, edit, and delete characters
  - Character categorization using AI on create or edit
  - Option to make characters discoverable
  - List characters with name, username, and category badges
- Implemented Chats: list, search, send and receive messages, view history
- Implemented Contacts: manage (add, edit, delete, search), view, and initiate chats from contact profiles
- Added language assistance features including translation and listening to messages
- Created "What's New"
- Created and linked issue report and feedback forms using Google Forms
- Created Terms of Service and Privacy Policy pages
- Created a landing page
