import "dotenv/config";

import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../auth";
import { environmentVariables } from "@/lib/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const db = new PrismaClient({ adapter });

async function main() {
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME } = environmentVariables;
  console.log("----------------------------------");
  console.log(SEED_ADMIN_EMAIL);
  console.log("----------------------------------");
  

  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD || !SEED_ADMIN_NAME) {
    throw new Error("Missing SEED_ADMIN_* environment variables.");
  }

  const existing = await db.user.findUnique({
    where: { email: SEED_ADMIN_EMAIL },
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        email: SEED_ADMIN_EMAIL,
        password: SEED_ADMIN_PASSWORD,
        name: SEED_ADMIN_NAME,
      },
    });

    console.log("✅ Admin user created.");
  } else {
    console.log("ℹ️ Admin already exists.");
  }

  await db.user.update({
    where: { email: SEED_ADMIN_EMAIL },
    data: {
      role: "admin",
    },
  });

  console.log("✅ Admin role assigned.");
}

main()
  .finally(async () => {
    await db.$disconnect();
  });