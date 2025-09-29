PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Character` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`discoverable` integer DEFAULT true NOT NULL,
	`prompt` text NOT NULL,
	`creator_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_Character`("id", "category_id", "discoverable", "prompt", "creator_id", "created_at", "updated_at", "deleted_at") SELECT "id", "category_id", "discoverable", "prompt", "creator_id", "created_at", "updated_at", "deleted_at" FROM `Character`;--> statement-breakpoint
DROP TABLE `Character`;--> statement-breakpoint
ALTER TABLE `__new_Character` RENAME TO `Character`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `Chat` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `Contact` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `LastMessage` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `OAuthAccount` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `OAuthAccount` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `OAuthAccount` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `Session` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `Username` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `User` DROP COLUMN `pronouns`;