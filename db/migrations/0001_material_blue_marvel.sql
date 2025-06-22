ALTER TABLE `Username` RENAME COLUMN "username" TO "text";--> statement-breakpoint
DROP INDEX `Username_username_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `Username_text_unique` ON `Username` (`text`);