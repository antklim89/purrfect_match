PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ad` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT '"2026-05-04T12:58:22.322Z"' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ad`("id", "name", "description", "category", "type", "user_id", "created_at", "updated_at") SELECT "id", "name", "description", "category", "type", "user_id", "created_at", "updated_at" FROM `ad`;--> statement-breakpoint
DROP TABLE `ad`;--> statement-breakpoint
ALTER TABLE `__new_ad` RENAME TO `ad`;--> statement-breakpoint
PRAGMA foreign_keys=ON;