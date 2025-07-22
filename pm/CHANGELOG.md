---
description: A detailed, chronological record of all changes made to a project, often including technical information.
---

# Changelog

## [Unreleased]

## [0.1.0-17] - 2025-07-22

### Added

- Introduced a "Contact Us" page, providing clear ways to reach out for support, legal, or security inquiries
- Added a "Contact Us" option to the "Settings & Help" menu and site footer, linking directly to the new contact page

### Changed

- Updated the revised Privacy Policy, Security Policy, and Terms of Service to reflect current practices and provide clearer information
- Reorganized the "Settings" menu, moving "What's New" and "Interface Language" into the "General" section

### Fixed

- Ensured legal document pages show consistent and helpful error messages if content is not found

### Beautified

- Improved the display of error messages throughout the app, making them consistently centered and more user-friendly
- Updated how navigation links behave across the app for a more consistent and accessible experience, including their active and focus states
- Refined the visual style of links within text content for better readability
- Improved the responsive layout of the landing page to provide a smoother experience on various screen sizes

## [0.1.0-16] - 2025-07-21

### Enhanced

- Chat now smoothly scrolls to the bottom when an AI response starts loading, ensuring you always see the latest content without sudden jumps
- Accordion sections on the landing page automatically scroll into view when expanded, improving navigation and content visibility
- Added more descriptive alternative text for images on the landing page, enhancing accessibility for screen readers and improving search engine visibility

### Performance

- Optimized the display of your chat list, resulting in quicker loading times and a more responsive interface

### Changed

- Updated the main website title and tagline to "Thal - Learn English like you’re texting a friend—not studying for a test" for a clearer description of the app's approach

### Fixed

- Fixed how 'What's New' content is loaded, ensuring quicker display
- Fixed redirect to app after checkout

## [0.1.0-15] - 2025-07-21

### Added

- Displayed visual indicators (small dots) on "What's New" menu items in the footer and settings to easily spot unread content
- Included a "Sign in" link in the website footer for users who are not logged in

### Enhanced

- Improved AI character behavior: characters now stick to their established knowledge and traits, and will indicate when they don't know an answer unless it goes against their persona
- Updated the website landing page design, including refreshed layouts for key sections and visual improvements to mockups

### Performance

- Significantly improved loading and display times for various app screens and components, including:
  - Chat screens (body, history, headers, footers, and individual messages)
  - Character Builder
  - Discover and Home screens
  - Sidebar navigation and chat lists
  - Pricing and "My Characters" pages

### Fixed

- Made animations for expandable content sections (accordions) across the website, particularly on the landing page, much smoother
- Added more descriptive alternative text for images on the landing page for better accessibility
- Ensured toast notifications now appear instantly, even when offline, for better responsiveness
- Resolved issues with chat list updates, improving the reliability and consistency of your chat history
- Ensured "What's New" content is now correctly marked as read immediately upon opening the modal
- Improved the play button interaction for audible text playback in chat
- Removed the "Report issue" option for "No internet" notifications, as these are expected occurrences
- Enhanced the handling of deleted contacts to prevent potential display issues
- Prevented errors by ensuring the chat query is only updated after the chat has fully loaded
- Fixed an issue where the "Try Again" button did not work after an error when adding a character without a draft; it now works correctly without needing to refresh the page

### Beautified

- Updated the website footer background for a cleaner appearance
- Standardized the styling of links across the website, including those for signing in, terms of service, and privacy policy
- Applied minor spacing adjustments for expandable sections on the website

## [0.1.0-14] - 2025-07-18

### Added

- Displayed a new banner on the Home, Discover, and Chat screens, providing information about the current release version
- Displayed a new badge showing the release status (e.g., Development, Preview, Early Access, Early Stable), which, when clicked, opens a modal with more details
- Made a new Security Policy document available, detailing how your data and the platform are protected
- Dynamically displayed "About Thal" options in the "Support" section in settings based on the app's release version

### Enhanced

- Improved landing page content and design
  - Clarified the purpose of talking to Thals to explicitly mention practicing and learning English
  - Added a new tagline to the website's main call-to-action section, highlighting the app's direct and no-nonsense approach to learning
  - Redesigned the main website homepage, the pricing page, and the overall website footer for a clearer, more organized, and visually appealing presentation

### Fixed

- Adapted modals better to different screen sizes and content lengths
- Made chat action buttons (edit, resend, copy, translate, delete) always visible on the last message, improving accessibility and ease of use
- Improved translation display toggle behavior and updated styling for better readability
- Fixed page transition effects for a smoother experience across the app and within the sidebar
- Fixed chat bubble animations
- Fixed chat automatic scroll to bottom
- Fixed chat SEO
- Fixed username validation to accept only lowercase letters with clearer validation messages during account creation and character editing

### Changed

- Updated links for sending feedback, reporting issues, and support emails
- Replaced the "Experimental" badge in the app header and sidebar with a "Release" badge, providing more accurate information about the app's development status
- Updated Terms of Service and Privacy Policy links to a new structure, aligning with the new Security Policy

### Beautified

- Updated the icon related to AI-powered messages in the footer for a more intuitive visual
- The positioning and display of toast notifications have been improved for a cleaner look
- The color scheme for pricing information has been updated for better visual appeal

## [0.1.0-13] - 2025-07-10

### Added

- Added What's New button to the site layout footer
- Added translation fallback on deleted characters

### Changed

- Updated "Terms" and "Privacy" links in the footer to "Terms of Service" and "Privacy Policy"

### Enhanced

- Renamed "Preview" to "After" and "Original" to "Before" in Portuguese in the Character Builder for improved clarity
- Enhanced confirmation modals for clearing chat history, deactivating accounts, and deleting characters for a clearer understanding of the action's consequences
- Enhanced the overall reliability and consistency of the sidebar navigation system
- Improved the validation messages for usernames in account settings and character builder for clearer feedback

### Fixed

- Removed pointer events none on toast component it now allows interaction with the toast content
- Fixed localization in route title and description, and in character item, common menu button, discover character list, site layout, 
- Fixed chat route title and description when character is not found/invalid and before sign-in
- Improved navigation within the Character Builder: going to chat after approval now automatically closes the sidebar
- Enhanced account security by ensuring all active user sessions are invalidated upon account deactivation
- Added subscription info below the checkout form.
- Fixed automatic redirect on first sign-in
- Fixed the "Message" button in the contact view that was hidden
- Addressed an issue where chat pages might not display chat and character information correctly if the character username or character was not found

### Beautified

- Enhanced footer layout for better responsiveness and visual consistency
- The "Rate Thal" and "Send feedback" links are now more prominently displayed in the footer
- Refined the save button logic in account settings, ensuring it's only enabled when actual changes are made
- Updated the color scheme and shadow style in the Character Builder for a more polished look
- Subtly adjusted the color scheme of the loading indicator for a softer visual experience
- Replaced the "What's New" icon with a more descriptive "campaign" icon in the app home screen and settings
- Reduced the size of the avatar in the site footer for better visual balance
- Applied subtle visual refinements to some footer links for a cleaner appearance

## [0.1.0-12] - 2025-07-08

### Added

- Added a confirmation modal on chat history clear

### Enhanced

- Fixed SEO meta tags for chat pages when character is not found/invalid
- Improved What's New content

### Fixed

- Fixed "Manage contact" sidebar opening without username on page load
- Fixed hydration errors on lazy components at the home page
- Fixed "Start Chatting" redirect to take users to the app after checkout
- Fixed locale change not replacing the current locale in the URL

## [0.1.0-11] - 2025-07-04

### Added

- Added a new section for feedback within the chat list
- Added automatic character prompting from search queries on the Discover route
- Added new "New character" and "Send feedback" options to the main application menu
- Added an "Edit character" action in the contact information view and chat header menu, visible to character owners
- Added a "Report issue" action to the error toast notifications

### Fixed

- Fixed logout button not working
- Fixed automatic redirect on checkout
- Fixed Contact View menu not closing when clicking on some menu items

### Enhanced

- Fixed toast position on large screens

### Changed

- Moved "Edit character" button from the chat header to the chat header menu
- Renamed the section from "Language" to "Interface language" in the settings page
- Renamed the common menu items to "Discover characters," "Manage subscription," and "Settings & Help"
- Changed support footer links to "Rate Thal" and "Send feedback"

### Performance

- Implemented new, dedicated sidebar views for Chats, Building Characters, Managing Contacts, and Starting New Chats, streamlining overall application navigation
- Launched new, dedicated pages for Account settings, My Characters, Profile, Settings & Help, and Character Builder, replacing previous pop-up drawer views for improved navigation flow
- Improved initial loading times and overall app responsiveness by dynamically loading modal and toast components

### Beautified

- Added a relevant icon to the "Renew subscription" button for better clarity
- Widened dropdown menus for character actions and general options for enhanced readability
- Added subtle fade-in and fade-out animations to messages in chat history for a more natural feel
- Improved navigation with a new sidebar system and smooth page and layout transition animations
- Applied subtle visual refinements to various interactive elements, including buttons and dropdowns, for a more polished look
- Introduced improved visual cues, such as enhanced focus outlines
- Simplified toast animations
- Made the locale modal height smaller
- Changed the app notes to a more compact and readable style

## [0.1.0-10] - 2025-06-26

### Added

- Added option to discard character draft
- Added edit action on character chat header if you are the owner
- Added prompt to build character based on search query
- Added go to character chat on character edition
- Added button countdowns for retrying errors on common resources
- Added character does not exist error fallback

### Changed

- Improved modal component with enhanced styling, title support, and scroll control
- Changed icons to use Material Symbols rounded style
- Improved icon choices
- Updated character generation prompts and guidelines to emphasize "authentic, real-world characters"
- Improved existing character categories with more detailed descriptions, new examples, and standardized slug names
- Updated navigation and layout components for a consistent and accessible navigation experience
- Overhauled the core button and field components with new styling and improved accessibility
- Improved color palette, new gradients and refined component styles across the application
- Improved drawer styling
- Improved styling of app notes
- Improved menu and setting section styling
- Improved common menu options styling
- Improved contact view drawer styling
- Improved character builder styling
- Improved in-reply-to styling
- Improved chat list styling
- Improved app home styling, accessibility and content to guide users towards key functionalities
- Improved discover route styling, accessibility and content
- Improved translations
- Improved landing page

### Fixed

- Improved chat component accessibility
- Improved error fallback components with clearer messages and retry options
- Fixed infinite loading on generate button in character builder
- Fixed SQL Constraint error on character deletion
- Refined validation rules for character fields
- Fixed scroll bottom button invisible click area
- Added missing translations

### Removed

- Removed pronouns from account settings
- Removed welcome guide note

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

### Enhanced

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
