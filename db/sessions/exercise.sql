-- @block Reset level

UPDATE Level SET current_exercise = 0, lesson_index = 0

-- @block List all exercises

SELECT * FROM Exercise

-- @block Delete all exercises

DELETE FROM Exercise

-- @block List all levels

SELECT * FROM Level

-- @block Delete all levels

DELETE FROM Level

--

-- @block

CREATE TABLE IF NOT EXISTS Challenge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(10),
  order_number INTEGER DEFAULT 0,
  mastery_score INTEGER DEFAULT 0
);

-- @block

CREATE TABLE IF NOT EXISTS Lesson (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id INTEGER NOT NULL,
  type VARCHAR(10),
  FOREIGN KEY (challenge_id) REFERENCES Challenges(id)
);