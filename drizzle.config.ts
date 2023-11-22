import { type Config } from "drizzle-kit";

const config: Config = {
  schema: "./lib/orms/drizzle/schema.ts",
  out: "./lib/orms/drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
};

export default config;
