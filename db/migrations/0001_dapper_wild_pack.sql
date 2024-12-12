CREATE TABLE `CharacterCategory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`creator_id` text,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `Persona` ADD `category_id` integer NOT NULL;