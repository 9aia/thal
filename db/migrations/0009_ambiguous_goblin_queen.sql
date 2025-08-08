ALTER TABLE `MessageAnalysisSummary` RENAME TO `MessageAnalysisExplanation`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_MessageAnalysisExplanation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`message_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`message_id`) REFERENCES `Message`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MessageAnalysisExplanation`("id", "content", "message_id", "created_at", "updated_at", "deleted_at") SELECT "id", "content", "message_id", "created_at", "updated_at", "deleted_at" FROM `MessageAnalysisExplanation`;--> statement-breakpoint
DROP TABLE `MessageAnalysisExplanation`;--> statement-breakpoint
ALTER TABLE `__new_MessageAnalysisExplanation` RENAME TO `MessageAnalysisExplanation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `MessageAnalysisExplanation_message_id_unique` ON `MessageAnalysisExplanation` (`message_id`);