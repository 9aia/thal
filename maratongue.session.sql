-- @block Drop user tables
DROP TABLE User;
DROP TABLE OAuthAccount;
DROP TABLE Session;

-- @block Delete all users
DELETE FROM User;
DELETE FROM Session;
DELETE FROM OAuthAccount;

-- @block List all users
SELECT * FROM User;

-- @block Remove plan for all users
UPDATE User SET plan = null;
UPDATE User SET plan_expires = null;
UPDATE User SET free_trial_used = 0;

-- @block Update plan expiration for all users
UPDATE User SET plan_expires = '2025-03-08T14:11:00';

-- @block Update user data from for users
UPDATE User SET profession = 'coder';

-- @block Add fake plan for all users
UPDATE User SET plan = 'premium', plan_expires = '2025-03-08T14:11:00', free_trial_used = 1
