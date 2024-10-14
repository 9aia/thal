-- @block Drop all database

PRAGMA writable_schema = 1;
delete from sqlite_master where type in ('table', 'index', 'trigger');
PRAGMA writable_schema = 0;

-- @block Drop Message table
DROP TABLE IF EXISTS Message;
