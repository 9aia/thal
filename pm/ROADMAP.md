# Roadmap

## Contract

- **Pre-`v1.0.0`**:
  - Data may be deleted without warning.
  - Free to try.

- **Release Candidate Versions (`vx.x.x-rc.x`)**:
  - Examples: `v0.1.0-rc.0`.
  - Used for private testing and gathering feedback.
  - Deployed on temporary environments.

- **Public Deploy Versions (`v0.x.x`)**:
  - Examples: `v0.1.0`.
  - Released on the main domain for broader public access.

- **Post-`v1.0.0`**:
  - Payment systems will be fully operational (no sandbox mode).

## Releases

### v0.1.0 - Fundamentals

- User Accounts (Sign in, Manage Account, Subscribe)
- Character Management (Discover, Manage)
- Chats
- Basic Language Assistance
- Contacts
- Basic Moderation
- Basic Support & Legal (Issue Report, Terms & Privacy)
- Site (Landing Page)

### v0.2.0 - Language Assistance

- Add option to listen to the message
- Add PT-EN translator in the chat input
- Add suggestions in chat
- Add tips
- Add modal "Dictionary"
  - Add conjugation table
  - Add grammar reference tables
- Add assistant
  - Add a help request item in the header menu (AI-driven).
  - Add settings to adjust AI helper responses.
- Real-time assistance features

- [ ] Stream translation
- [ ] Add a deleted/non-existent section in contacts

### v0.3.0 - Generative Character Building

- Add character build tool based on Profile form
- Input prompt to generate a character
- "Surprise Me" feature for auto-generated character
- Improve custom character building tab
  - Add "generate" icon button to each field (e.g., name, description)
- Fork characters
- [ ] Add profile photos (generate or upload)

### v0.4.0 - Sharing

- Add contact QR code
- Add character visibility option instead of just discoverability
  - Prevent private character actions in any request
  - Prevent private character to be accessed in URL
- List private character from contact list in a different section
- Share character via WhatsApp message
- Send message via URL query

### v1.0.0 - Multiplayer

- Add a top absolute toast "Share your invite code with friends" and menu option "Invite"
- Blocking
- Public profile
- Person-person chats
- Groups
