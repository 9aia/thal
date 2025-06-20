PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`sender_username_id` integer,
	`content` text NOT NULL,
	`in_reply_to_id` integer,
	`is_bot` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_username_id`) REFERENCES `Username`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`in_reply_to_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Message`("id", "chat_id", "sender_username_id", "content", "in_reply_to_id", "is_bot", "created_at") SELECT "id", "chat_id", "sender_username_id", "content", "in_reply_to_id", "is_bot", "created_at" FROM `Message`;--> statement-breakpoint
DROP TABLE `Message`;--> statement-breakpoint
ALTER TABLE `__new_Message` RENAME TO `Message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_LastMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`content` text NOT NULL,
	`datetime` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_LastMessage`("id", "chat_id", "content", "datetime") SELECT "id", "chat_id", "content", "datetime" FROM `LastMessage`;--> statement-breakpoint
DROP TABLE `LastMessage`;--> statement-breakpoint
ALTER TABLE `__new_LastMessage` RENAME TO `LastMessage`;