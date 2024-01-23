-- @block
CREATE TABLE IF NOT EXISTS Users (
  id VARCHAR(15) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  plan VARCHAR(255) DEFAULT 'Free',
  payment_gateway_customer_id VARCHAR(255)
);

-- @block
CREATE TABLE IF NOT EXISTS UserKeys (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  hashed_password VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- @block
CREATE TABLE IF NOT EXISTS UserSessions (
  id VARCHAR(127) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  active_expires BIGINT NOT NULL,
  idle_expires BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
