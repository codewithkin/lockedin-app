import path from "node:path";

import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({
  path: "../../apps/server/.env",
});

// `prisma generate` runs as a postinstall across the whole pnpm workspace
// (e.g. during EAS native builds) where no real database is configured.
// Generate never connects, so fall back to a non-functional placeholder URL
// instead of hard-throwing when DATABASE_URL is absent.
const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/lockedin";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: DATABASE_URL,
  },
});
