CREATE TABLE `MessageAnalysisExplanationsLocalization` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message_analysis_explanation_id` integer NOT NULL,
	`locale` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`message_analysis_explanation_id`) REFERENCES `MessageAnalysisExplanation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `MessageAnalysisExplanation` DROP COLUMN `content`;