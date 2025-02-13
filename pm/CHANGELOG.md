---
description: A detailed, chronological record of all changes made to a project, often including technical information.
---

# Changelog

## [Unreleased]

### Changed

- Moved worker to Gaia account
- Moved database to Gaia account
- Moved domain to Gaia domain
- Read URL from cloudflare request
- Added Shortcut for Discover characters

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
