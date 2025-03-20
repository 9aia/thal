-- @block List all characters

SELECT * FROM Character

-- @block Delete all characters and usernames

DELETE FROM CharacterUsername;
DELETE FROM Character;
DELETE FROM CharacterDraft;

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

-- @block Delete all character drafts
DELETE FROM CharacterDraft
