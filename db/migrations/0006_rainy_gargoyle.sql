PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`pronouns` text,
	`picture` text,
	`created_at` text NOT NULL,
	`email` text,
	`plan` integer,
	`subscription_status` integer DEFAULT 0,
	`subscription_id` text,
	`stripe_customer_id` text,
	`free_trial_used` integer DEFAULT false,
	`deactivated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "username", "name", "last_name", "pronouns", "picture", "created_at", "email", "plan", "subscription_status", "subscription_id", "stripe_customer_id", "free_trial_used", "deactivated_at") SELECT "id", "username", "name", "last_name", "pronouns", "picture", "created_at", "email", "plan", "subscription_status", "subscription_id", "stripe_customer_id", "free_trial_used", "deactivated_at" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);