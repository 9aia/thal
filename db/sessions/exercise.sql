-- @block

CREATE TABLE IF NOT EXISTS Challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(10),
  order_number INTEGER DEFAULT 0,
  mastery_score INTEGER DEFAULT 0
);

-- @block

CREATE TABLE IF NOT EXISTS Lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id INTEGER NOT NULL,
  type VARCHAR(10),
  FOREIGN KEY (challenge_id) REFERENCES Challenges(id)
);

-- @block List all exercises

SELECT * FROM Exercises
