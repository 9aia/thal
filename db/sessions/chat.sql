-- @block List all chats

SELECT * FROM Chat

-- @block Delete all chats

DELETE FROM Chat

--- @block Drop chat table

DROP TABLE Chat

--- @block Delete last messages

DELETE FROM LastMessage

--- @block Clear messages

DELETE FROM "Chat";
DELETE FROM "Message";
DELETE FROM "LastMessage";
