import Database from "better-sqlite3";
import {
  BetterSQLite3Database,
  drizzle as drizzleOrm,
} from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("sqlite.db");
export const drizzle: BetterSQLite3Database = drizzleOrm(sqlite);

migrate(drizzle, { migrationsFolder: "./lib/orms/drizzle/migrations" });
