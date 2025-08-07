---
description: Tasks and items for the release.
---

# TODO

- Improve analysis prompting (it's not working for fantasy, not considering politeness as well)
- Add highlighted diffing to the message analysis modal
- Save localized message analysis summary in the database
- Add explain functionality to the message analysis modal
- Add critical summary below the message?
- How to modify analysis based on future messages?

## 0.2.0

## 0.2.1

### Issues related:

- Force test with ton of characters, chats, contacts and messages
- Virtual scroll for chats, messages and discover
- Improve SEO, robots.txt, meta tags, etc
  - Fix character seo tags
- Add infinite queries to lists (specially chat)
- Deal with long history on translate
- Fix listening to long messages
- Handle longer contexts

### Post-release tasks:

- Create characters
- Share Thal with friends, family, colleagues, etc.

## 0.3.0

- Save translations in the database (it will be useful for analytics and be used to improve the translation quality)
  - Refactor translate endpoint into `/api/message/translate` with `messageId` param?

- Allow users to see the translation on a popover by selecting a text/word on the message, also below the translation the user can COPY, LISTEN

- Implement basic analytics to track user engagement and app performance

## 0.4.0 - Language Assistance Improvements

- Add text input correction confirmation popover
  - Diffing
  - Actions: "Regenerate", "Explain", "Apply", "Ignore"

- Consider userId in query keys
- Fix error page not showing translation
- Ensure the app note is up to date
- Add conversation starters for users
- Add follow up message suggestions

## 0.5.0

- Language Practice Reminders: Send notifications encouraging users to engage in language practice with their saved characters.
  - Daily/week reminders to keep users practicing
  - Push Notifications: Reminders and encouragement to practice regularly
  - Add to terms that we can send email notifying messages of characters (after off-line daily)

- After days not used the app, the character sends a message (powered by character memory to create a persuasive but with the character persnality). The idea is t ouse 1–2 facts of the user or them (e.g. name, hobby, last topic). Drop them naturally like “So, how’s your guitar practice going?” Boom—instant connection. (This improves Retention)

- Continue backlog
- Look for TODOS inside the codebase
