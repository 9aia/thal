---
description: Tasks and items for the release.
---

# TODO

- Fix sign-in back redirect with drawers
- Fix empty message sending
- Change pricing button to "Start Chatting" after already started free trial
- Fix pending middleware
- Fix go-to-bottom button position after chat clearing
- Add button to create character in the discover characters page (aside of search field)
- Fix last dropdown position
- Fix "[Vue warn]: inject() can only be used inside setup() or functional components." after click on options menu
- Fix what's new indicator
- Infinite scroll not working on big screens in Discover characters
- Deal with expired plan
- Add plan middleware to api routes
- Refactor Stripe subscription
- Add markdown support to messages
- Fix DB on build pre-render

- Open chat list on mobile always
- Add more characters pre-created

- Require users to re-accept the privacy or terms when changed

## 0.1.0-6

- Add moderation
  - Create community guidelines
    - Add community guidelines link to the "Character Builder", chats and settings
  - Give safety feedback on character create/edit
  - Give safety feedback on message send/receive
  - Give safety feedback on fields
  - Add safety inflation flags and strikes
    - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period.
- Implement basic analytics to track user engagement and app performance
- Add logger
- Add tooltip for icon buttons
- Polish design system
- Add profile photos (generate or upload)
- Add character unique voices
- Add language drawer containing UI language and translation settings
- Add config for time

## 0.1.0-7

- Update terms and privacy policy
- Update terms to include info about price changing and inform cancel anytime before the trial ends to avoid charges.
