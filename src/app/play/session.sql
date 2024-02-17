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

-- @block
CREATE TABLE IF NOT EXISTS Exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  type VARCHAR(10),
  data TEXT,
  FOREIGN KEY (lesson_id) REFERENCES Lessons(id)
);

-- @block
INSERT INTO Challenges (id, unit_id, name, description, type, order_number, mastery_score) VALUES (0, 0, 'Challenge 1', 'Desc', 'normal', 0, 5)

-- @block
INSERT INTO Lessons (id, challenge_id, type) VALUES (0, 0, 'normal')
