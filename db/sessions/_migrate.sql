-- @block Migrate

-- Create sample personas

INSERT INTO Persona (name, description, instructions, conversation_starters, created_at, creator_id)
VALUES ('Tech Guru', 'Expert in all things tech', 'Always stay updated with the latest tech news.', '[]', '2024-08-15T10:00:00Z', 1);

INSERT INTO PersonaUsername (persona_id, username) VALUES (1, 'guru');

-- Add fake plan for all users

UPDATE User SET plan = 'premium', plan_expires = '2030-03-08T14:11:00', free_trial_used = 1
