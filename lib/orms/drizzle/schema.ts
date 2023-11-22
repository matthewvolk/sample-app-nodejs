import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  email: text("email").notNull(),
  username: text("username"),
});

export const stores = sqliteTable("stores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  storeHash: text("store_hash").notNull().unique(),
  accessToken: text("access_token").notNull(),
  scope: text("scope").notNull(),
});

export const storeUsers = sqliteTable(
  "store_users",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    storeHash: text("store_hash").notNull(),
    isAdmin: integer("id", { mode: "boolean" }),
  },
  (storeUsers) => ({
    userId_storeHash: unique("userId_storeHash").on(
      storeUsers.userId,
      storeUsers.storeHash
    ),
  })
);
