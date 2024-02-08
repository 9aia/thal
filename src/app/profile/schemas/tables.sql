-- @block
CREATE TABLE IF NOT EXISTS Profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  signupDate DATETIME NOT NULL,
  pronouns VARCHAR(24),
  goals VARCHAR(255),
  worktime VARCHAR(255),
  uselessSkill VARCHAR(255),
  bioTitle VARCHAR(255),
  obsession VARCHAR(255),
  location VARCHAR(255),
  interests TEXT
);
