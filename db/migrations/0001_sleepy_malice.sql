CREATE TABLE `LevelState` (
	`id` text PRIMARY KEY NOT NULL,
	`completed_lessons` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `CourseState` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`section_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`section_id`) REFERENCES `SectionState`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `SectionState` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`unit_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`unit_id`) REFERENCES `UnitState`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `UnitState` (
	`id` text PRIMARY KEY NOT NULL,
	`level_id` text NOT NULL,
	FOREIGN KEY (`level_id`) REFERENCES `LevelState`(`id`) ON UPDATE no action ON DELETE cascade
);
