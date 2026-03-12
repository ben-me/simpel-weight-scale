PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_settings`("key", "value") SELECT "key", "value" FROM `settings`;--> statement-breakpoint
DROP TABLE `settings`;--> statement-breakpoint
ALTER TABLE `__new_settings` RENAME TO `settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_weight` (
	`date` text PRIMARY KEY NOT NULL,
	`weight` real,
	`unit` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_weight`("date", "weight", "unit") SELECT "date", "weight", "unit" FROM `weight`;--> statement-breakpoint
DROP TABLE `weight`;--> statement-breakpoint
ALTER TABLE `__new_weight` RENAME TO `weight`;