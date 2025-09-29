CREATE TABLE `CorrectedMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text,
	`message_id` integer NOT NULL,
	`severity` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`ignored_at` integer,
	FOREIGN KEY (`message_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CorrectedMessage_message_id_unique` ON `CorrectedMessage` (`message_id`);--> statement-breakpoint
ALTER TABLE `MessageAnalyses` ADD `ignored_at` integer;