CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `weight` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text,
	`weight` real,
	`unit` text DEFAULT 'KG' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weight_date_unique` ON `weight` (`date`);
