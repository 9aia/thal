-- @block
CREATE TABLE IF NOT EXISTS Users (
  id VARCHAR(15) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  signupDate DATETIME NOT NULL,
  pronouns VARCHAR(24),
  location VARCHAR(255),
  goals VARCHAR(127),
  hobbies VARCHAR(127),
  profession VARCHAR(20),
  observation VARCHAR(300),
  plan VARCHAR(255),
  payment_gateway_customer_id VARCHAR(255),
  payment_gateway_session_id VARCHAR(255),
  plan_expires VARCHAR(255),
  free_trial_used INT DEFAULT 0
);
