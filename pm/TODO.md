---
description: Tasks and items for the release.
---

# TODO

- Refactor Stripe subscription
  - Use freeTrialUsed flag to solve dup free trial
  - Handle "Manage your billing information" when plan is null
  - Deal with expired plan on client
  - Add plan middleware to API routes (should have a plan and not expired to be allowed to use)
  - Display homepage CTA based on checkout/plan status
  - Update CHANGELOG
- Fix last dropdown position
- Infinite scroll not working on big screens in Discover characters
- Only allow one text to speech at a time.
- Avoid breaking layout in chat item when last message is too long.
- Fix DB on build pre-render

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
