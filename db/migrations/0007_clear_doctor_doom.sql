ALTER TABLE `MessageAnalyses` RENAME TO `MessageAnalysisSummary`;--> statement-breakpoint
ALTER TABLE `MessageAnalysisSummary` RENAME COLUMN "data" TO "content";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_MessageAnalysisSummary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`message_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`message_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MessageAnalysisSummary`("id", "content", "message_id", "created_at", "updated_at") SELECT "id", "content", "message_id", "created_at", "updated_at" FROM `MessageAnalysisSummary`;--> statement-breakpoint
DROP TABLE `MessageAnalysisSummary`;--> statement-breakpoint
ALTER TABLE `__new_MessageAnalysisSummary` RENAME TO `MessageAnalysisSummary`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `MessageAnalysisSummary_message_id_unique` ON `MessageAnalysisSummary` (`message_id`);