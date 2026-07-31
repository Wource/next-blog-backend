import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "lib/api/shared/infrastructure/prisma/schema/.",
  migrations: {
    path: "lib/api/shared/infrastructure/prisma/migrations",
    seed: "npx tsx lib/api/shared/infrastructure/prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
