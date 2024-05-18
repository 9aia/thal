-- @block Drop user tables

DROP TABLE User;
DROP TABLE OAuthAccount;
DROP TABLE Session;

-- @block Delete all users

DELETE FROM User;
DELETE FROM Session;
DELETE FROM OAuthAccount;

-- @block List all users

SELECT * FROM User;