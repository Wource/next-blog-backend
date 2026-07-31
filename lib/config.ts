import "dotenv/config";
import { config } from "dotenv";

interface EnvironmentVariables {
    DATABASE_URL: string;

    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    AUTH_TRUST_HOST: "true" | "false";

    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;

    // PRISMA_SKIP_POSTINSTALL_GENERATE: "true" | "false";
    // PRISMA_SCHEMA_ENGINE_BINARY: string;
    // PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "0" | "1";

    MINIO_ENDPOINT: string;
    MINIO_BUCKET_NAME: string;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;

    SEED_ADMIN_EMAIL: string
    SEED_ADMIN_PASSWORD: string
    SEED_ADMIN_NAME:string

}

export const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: process.env.DATABASE_URL!,

  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST as "true" | "false",

  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DB: process.env.POSTGRES_DB!,

  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME!,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,

  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL!,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD!,
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME!
};