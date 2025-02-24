-- @block Update plan expiration for all users

-- TODO

-- @block Add fake plan for all users

-- TODO

-- @block Remove plan from all users

UPDATE User SET plan = null, stripe_customer_id = null, subscription_id = null, subscription_status = 0, checkout_id = null;

-- @block Remove plan from User with a username

UPDATE User SET plan = null, stripe_customer_id = null, subscription_id = null, subscription_status = 0, checkout_id = null WHERE username = 'viniemidiobosi7570';
