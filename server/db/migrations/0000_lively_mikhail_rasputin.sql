CREATE TABLE `CharacterDraftLocalization` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_draft_id` integer,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`instructions` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`character_draft_id`) REFERENCES `CharacterDraft`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `CharacterDraft` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer,
	`creator_id` text,
	`prompt` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `CharacterLocalization` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`instructions` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Character` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`discoverable` integer DEFAULT true NOT NULL,
	`prompt` text NOT NULL,
	`creator_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_username_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`contact_id` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`character_username_id`) REFERENCES `Username`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contact_id`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Chat_user_id_character_username_id_unique` ON `Chat` (`user_id`,`character_username_id`);--> statement-breakpoint
CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`username_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`username_id`) REFERENCES `Username`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Contact_user_id_username_id_unique` ON `Contact` (`user_id`,`username_id`);--> statement-breakpoint
CREATE TABLE `LastMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`content` text NOT NULL,
	`status` integer NOT NULL,
	`datetime` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`sender_username_id` integer,
	`content` text NOT NULL,
	`status` integer NOT NULL,
	`in_reply_to_id` integer,
	`is_bot` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_username_id`) REFERENCES `Username`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`in_reply_to_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `OAuthAccount` (
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Username` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer,
	`user_id` text,
	`text` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Username_text_unique` ON `Username` (`text`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`pronouns` text,
	`picture` text,
	`email` text,
	`plan` integer,
	`free_trial_used` integer DEFAULT false,
	`subscription_status` integer DEFAULT 0,
	`subscription_id` text,
	`stripe_customer_id` text,
	`checkout_id` text,
	`deactivated_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
