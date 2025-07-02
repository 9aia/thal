PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`contact_id` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`username_id`) REFERENCES `Username`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contact_id`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_Chat`("id", "username_id", "user_id", "contact_id", "created_at", "updated_at", "deleted_at") SELECT "id", "character_username_id", "user_id", "contact_id", "created_at", "updated_at", "deleted_at" FROM `Chat`;--> statement-breakpoint
DROP TABLE `Chat`;--> statement-breakpoint
ALTER TABLE `__new_Chat` RENAME TO `Chat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `Chat_user_id_username_id_unique` ON `Chat` (`user_id`,`username_id`);