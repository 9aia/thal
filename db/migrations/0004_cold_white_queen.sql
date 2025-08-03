CREATE TABLE `MessageAnalyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data` text NOT NULL,
	`message_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`message_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`content` text NOT NULL,
	`status` integer NOT NULL,
	`in_reply_to_id` integer,
	`is_bot` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`in_reply_to_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Message`("id", "chat_id", "content", "status", "in_reply_to_id", "is_bot", "created_at", "updated_at", "deleted_at") SELECT "id", "chat_id", "content", "status", "in_reply_to_id", "is_bot", "created_at", "updated_at", "deleted_at" FROM `Message`;--> statement-breakpoint
DROP TABLE `Message`;--> statement-breakpoint
ALTER TABLE `__new_Message` RENAME TO `Message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;