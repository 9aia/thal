-- @block
CREATE TABLE IF NOT EXISTS UserKeys (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  hashed_password VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- @block
CREATE TABLE IF NOT EXISTS UserSessions (
  id VARCHAR(127) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  active_expires BIGINT NOT NULL,
  idle_expires BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);
