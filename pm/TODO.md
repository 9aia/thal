---
description: Tasks and items for the release.
---

# TODO

- Fix sign-in back redirect with drawers
- Change pricing button to "Start Chatting" after already started free trial
- Fix pending middleware
- Fix go-to-bottom button position after chat clearing
- Add button to create character in the discover characters page (aside of search field)
- Fix last dropdown position
- Fix what's new indicator
- Infinite scroll not working on big screens in Discover characters
- Refactor Stripe subscription
  - Deal with expired plan
  - Add plan middleware to api routes
- Fix DB on build pre-render
- Open chat list on mobile always
- Only allow one text to speech at a time.
- Avoid breaking layout in chat item when last message is too long.

## 0.1.0-6

- Add moderation
  - Create community guidelines
    - Add community guidelines link to the "Character Builder", chats and settings
  - Give safety feedback on character create/edit
  - Give safety feedback on message send/receive
  - Give safety feedback on fields
  - Add safety inflation flags and strikes
    - Assigning each user a unique ID and imposing a limit on the volume of user queries that can be submitted in a given period.
- Polish design system
- Add character unique voices
- Add language drawer containing UI language and translation settings
- Add config for time

## 0.1.0-7

- Add more characters pre-created
- Update terms and privacy policy
- Update terms to include info about price changing and inform cancel anytime before the trial ends to avoid charges.
- Require users to re-accept the privacy or terms when changed
- Implement basic analytics to track user engagement and app performance
- Improve logging
