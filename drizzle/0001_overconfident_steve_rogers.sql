PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_weight` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`weight` real,
	`unit` text DEFAULT 'KG' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_weight`("id", "date", "weight", "unit") SELECT "id", "date", "weight", "unit" FROM `weight`;--> statement-breakpoint
DROP TABLE `weight`;--> statement-breakpoint
ALTER TABLE `__new_weight` RENAME TO `weight`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `weight_date_unique` ON `weight` (`date`);