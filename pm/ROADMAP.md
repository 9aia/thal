---
description: A timeline of key milestones and upcoming features or releases.
---

# Roadmap

## Contract

**`vMAJOR.MINOR.PATCH-PRERELEASE`**:

### Preview Releases

- Template: `vMAJOR.MINOR.PATCH-PRERELEASE`
- Example: `v0.1.0-0` (pre-release)
- Can be accessed at [preview.thal.9aia.com](https://preview.thal.9aia.com)
- The preview may break or change often
- Used for testing or polishing upcoming features or improvements remotely
- Used for the first remote feedback gathering
- Deployed on temporary environments
- Data may be deleted without warning
- Free to try

### Early Access Releases

- Template: `vMAJOR.MINOR.PATCH` below `v1.0.0`
- Example: `v0.2.0`
- Can be accessed at [thal.9aia.com](https://thal.9aia.com)
- Released on the main domain for broader public access
- Payment systems will be fully operational (no sandbox mode)
- Includes core mechanics and features
- Will include new features and improvements based on feedback

### Early Stable Releases

- Template: `vMAJOR.MINOR.PATCH` below `v1.1.0`
- Example: `v1.0.2`
- Can be accessed at [thal.9aia.com](https://thal.9aia.com)
- Released on the main domain for broader public access
- Payment systems will be fully operational (no sandbox mode)
- Will include only critical patches if needed

### Stable Releases

- Template: `vMAJOR.MINOR.PATCH` equals or above `v1.1.0`
- Example: `v1.2.0`
- Can be accessed at [thal.9aia.com](https://thal.9aia.com)
- Released on the main domain for broader public access
- Payment systems will be fully operational (no sandbox mode)
- Will include stable functionality

## Phases

### Fundamentals

- User Accounts (Sign in, Manage Account)
- Subscription
- Character Management (Discover, Manage)
- Chats
- Basic Language Assistance (Message Translation, Input Fix, Listen to Message)
- Contacts
- Basic Moderation
- Basic Support & Legal (Feedback Form & Rate; Security, Terms & Privacy)
- Site (Landing Page, Contact Us Page)

### Expansion

#### Language Assistance

- Implement message corrector
- Add speech synthesis settings (voice and locale)
- Add suggestions for the first message
- Add opt-in for follow-ups
  - Generate possible follow-ups (maybe option on the message bubble?)
- Add modal "Dictionary"/reference (plural forms, conjugation, participles)
- Add AI assistant
  - Add a help request item in the header menu (AI-driven)
  - Add a message action to ask the AI assistant for help with the message
  - Add settings to adjust AI helper responses
- Stream translation

#### Chats

- Allow characters to send messages to users
- Allow users to block characters

#### Generative Character Building

- Generate a character from a framework (asking the learning goals, interests, occupation and observations)
- "Surprise Me" feature for auto-generated character based on "about me" textarea
- Display character configured instructions
  - Add "Keep Character instructions private" to Character Builder
- Fork characters
- Add character edit button (if its yours) to contact options
- Add recently created section in new chat view
- Add profile photos (generate or upload)
- Add recent added characters section to the Discover page

#### Support

- Add report button (open modal) to contact options
- Add intuitive placeholders to fields
- Add length indicator to fields
- Add help center
  - Add FAQ
  - Add troubleshooting tips
  - Add contact us info
  - Add onboarding guide
  - Add "About Thal" in help section in settings
  - Add "App Info" (app name, icon, version, author, licenses)
- Add a warning for renaming character usernames
- Open character info by clicking on the AI warning item in the contact view
- Add "Export account data"
- Delete account data

#### Sharing

- Add contact QR code
- Add character visibility option instead of just discoverability
  - Prevent private character actions in any request
  - Prevent private character to be accessed in URL
- List private character from contact list in a different section
- Share character card (WhatsApp, X, Facebook, etc)
- Send message via URL query
- Display character author in the contact view and item in discover character route
- Add a top absolute toast "Share your invite code with friends" and menu option "Invite"

#### Multiplayer

- Public profile
- Person-person chats
- Blocks

#### Groups

- Groups of 1 character and max of 5 people
- Groups

#### Communities

- Add communities
