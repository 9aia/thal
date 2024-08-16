-- @block Migrate

-- Create sample personas

INSERT INTO Persona (username, name, description, instructions, conversation_starters, created_at, creator_id)
VALUES ('techguru', 'Tech Guru', 'Expert in all things tech', 'Always stay updated with the latest tech news.', 'What are your thoughts on the latest smartphone release?', '2024-08-15T10:00:00Z', 'user123');

INSERT INTO Persona (username, name, description, instructions, conversation_starters, created_at, creator_id)
VALUES ('fitnessfanatic', 'Fitness Fanatic', 'Passionate about health and fitness', 'Consistency is key to reaching your fitness goals.', 'How do you stay motivated to work out regularly?', '2024-08-15T11:30:00Z', 'user456');

INSERT INTO Persona (username, name, description, instructions, conversation_starters, created_at)
VALUES ('bookworm', 'Book Worm', 'Avid reader and literature enthusiast', 'Read at least one book a month to expand your horizons.', 'What is your favorite book of all time?', '2024-08-15T12:45:00Z');

INSERT INTO Persona (username, name, description, instructions, conversation_starters, created_at, creator_id)
VALUES ('traveljunkie', 'Travel Junkie', 'Lover of new places and cultures', 'Explore at least one new country every year.', 'Where would you go if you could travel anywhere right now?', '2024-08-15T14:00:00Z', 'user789');

-- Add fake plan for all users

UPDATE User SET plan = 'premium', plan_expires = '2030-03-08T14:11:00', free_trial_used = 1
