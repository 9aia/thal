CREATE TABLE `CharacterDraft` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer,
	`creator_id` text,
	`prompt` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `Character`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `Character` DROP COLUMN `conversation_starters`;--> statement-breakpoint
ALTER TABLE `Character` DROP COLUMN `prompt`;