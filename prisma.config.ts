import "dotenv/config";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV !== "production" ? ".env.local" : ".env",
});

export default defineConfig({
  schema: "lib/api/shared/infrastructure/prisma/schema/.",
  migrations: {
    path: "lib/api/shared/infrastructure/prisma/migrations",
    seed: "tsx lib/api/shared/infrastructure/prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
