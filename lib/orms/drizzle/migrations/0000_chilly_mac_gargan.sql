CREATE TABLE `store_users` (
	`id` integer,
	`user_id` integer NOT NULL,
	`store_hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_hash` text NOT NULL,
	`access_token` text NOT NULL,
	`scope` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`email` text NOT NULL,
	`username` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userId_storeHash` ON `store_users` (`user_id`,`store_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `stores_store_hash_unique` ON `stores` (`store_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_id_unique` ON `users` (`user_id`);