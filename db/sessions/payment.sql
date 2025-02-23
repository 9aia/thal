-- @block Remove plan for all users

UPDATE User SET plan = null;
UPDATE User SET plan_expires = null;
UPDATE User SET free_trial_used = 0;

-- @block Update plan expiration for all users

UPDATE User SET plan_expires = '2026-03-08T14:11:00';

-- @block Add fake plan for all users

UPDATE User SET plan = 'thal_all_in_one', plan_expires = '2025-03-08T14:11:00', free_trial_used = 1

-- @block Remove plan from all users

UPDATE User SET plan = null, stripe_customer_id = null, subscription_id = null, subscription_status = 0, checkout_id = null;

-- @block Remove plan from User with a username

UPDATE User SET plan = null, plan_expires = null, free_trial_used = 0 WHERE username = 'viniemidiobosi7570';
