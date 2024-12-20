-- @block List all personas

SELECT * FROM Persona

-- @block Delete all personas

DELETE FROM Persona

-- @block List all PersonaUsernames

SELECT * FROM PersonaUsername

-- @block Update all PersonaUsernames.username to be lowercase

UPDATE PersonaUsername SET username = LOWER(username)

-- @block Make all personas discoverable

UPDATE Persona SET discoverable = 1

-- @block Make a persona undiscoverable

UPDATE Persona SET discoverable = 0 WHERE id = 7
