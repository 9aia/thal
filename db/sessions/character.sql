-- @block List all characters

SELECT * FROM Character

-- @block Delete all character data

DELETE FROM CharacterUsername;
DELETE FROM Character;
DELETE FROM CharacterDraft;
DELETE FROM CharacterDraftLocalization;

-- @block Make all characters discoverable

UPDATE Character SET discoverable = 1

-- @block Make a character undiscoverable

UPDATE Character SET discoverable = 0 WHERE id = 7

-- ------------------ CharacterUsername ------------------

-- @block List all CharacterUsernames

SELECT * FROM CharacterUsername

-- @block Update all CharacterUsernames.username to be lowercase

UPDATE CharacterUsername SET username = LOWER(username)

-- ------------------ CharacterDraft ------------------

-- @block List all drafts
SELECT * FROM CharacterDraft

-- @block List all draft localizations
SELECT * FROM CharacterDraftLocalization

-- @block List characters left joined with name

SELECT c.id, cl.locale, cl.name, cl.description, cl.instructions
  FROM Character c
  LEFT JOIN CharacterLocalization cl ON c.id = cl.character_id
  WHERE cl.locale = 'en-US'

-- @block Delete all character drafts
DELETE FROM CharacterDraft;
DELETE FROM CharacterDraftLocalization;
