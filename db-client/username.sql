-- ------------------ Username ------------------

-- @block List all Usernames

SELECT * FROM Username

-- @block Update all Usernames.username to be lowercase

UPDATE Username SET username = LOWER(username)
