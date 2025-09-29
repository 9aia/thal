ALTER TABLE `MessageAnalysisExplanation` ADD `regenerated_at` integer;--> statement-breakpoint
ALTER TABLE `MessageAnalysisExplanation` ADD `ignored_at` integer;--> statement-breakpoint
ALTER TABLE `MessageAnalysisExplanation` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `MessageAnalysisExplanation` DROP COLUMN `deleted_at`;