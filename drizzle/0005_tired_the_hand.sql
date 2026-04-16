PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_weight` (
	`date` text PRIMARY KEY NOT NULL,
	`weight` real,
	`unit` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_weight`("date", "weight", "unit") SELECT "date", "weight", "unit" FROM `weight`;--> statement-breakpoint
DROP TABLE `weight`;--> statement-breakpoint
ALTER TABLE `__new_weight` RENAME TO `weight`;--> statement-breakpoint
PRAGMA foreign_keys=ON;