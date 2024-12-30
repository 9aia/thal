CREATE TABLE `Chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`persona_username_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`contact_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`persona_username_id`) REFERENCES `PersonaUsername`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contact_id`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`persona_username_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`persona_username_id`) REFERENCES `PersonaUsername`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `LastMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`content` text NOT NULL,
	`datetime` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`data` text NOT NULL,
	`replying_id` integer,
	`is_bot` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`replying_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `OAuthAccount` (
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `PersonaUsername` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`persona_id` integer,
	`username` text NOT NULL,
	FOREIGN KEY (`persona_id`) REFERENCES `Persona`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Persona` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`instructions` text NOT NULL,
	`conversation_starters` text NOT NULL,
	`created_at` text NOT NULL,
	`creator_id` text,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`pronouns` text,
	`picture` text,
	`created_at` text NOT NULL,
	`email` text,
	`plan` text,
	`payment_gateway_customer_id` text,
	`payment_gateway_session_id` text,
	`plan_expires` text,
	`free_trial_used` integer DEFAULT 0,
	`location` text,
	`goals` text,
	`profession` text,
	`hobbies` text,
	`observation` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Chat_user_id_persona_username_id_unique` ON `Chat` (`user_id`,`persona_username_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Contact_user_id_persona_username_id_unique` ON `Contact` (`user_id`,`persona_username_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `PersonaUsername_username_unique` ON `PersonaUsername` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);