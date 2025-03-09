-- @block Add fake plan for all users

UPDATE User SET plan = "all_in_one", stripe_customer_id = "cus_RtFZSxcp1rinbu", subscription_id = "sub_1QzT9UD5fsebajlPH7TrOjKM", subscription_status = 1, checkout_id = "cs_test_a1Rbv8unArqKBlJ6lf7YJzpbPR1b2dV6FeRraTdPqOazVTjHpVX1uoO4cZ"

-- @block Remove plan from all users

UPDATE User SET plan = null, stripe_customer_id = null, subscription_id = null, subscription_status = 0, checkout_id = null;

-- @block Remove plan from User with a username

UPDATE User SET plan = null, stripe_customer_id = null, subscription_id = null, subscription_status = 0, checkout_id = null WHERE username = 'viniemidiobosi7570';
