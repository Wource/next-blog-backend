import "dotenv/config";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

interface EnvironmentVariables {
    DATABASE_URL: string;

    NEXTAUTH_URL: string;
    AUTH_SECRET: string;
    AUTH_TRUST_HOST: "true" | "false";

    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: string;

    APP_PORT: string;

    PRISMA_SKIP_POSTINSTALL_GENERATE: "true" | "false";
    PRISMA_SCHEMA_ENGINE_BINARY: string;
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: "0" | "1";

    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;

    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;

    ARVANCLOUD_ENDPOINT: string;
    ARVANCLOUD_GET_ENDPOINT: string;
    ARVANCLOUD_BUCKET_NAME: string;
    ARVANCLOUD_ACCESS_KEY: string;
    ARVANCLOUD_SECRET_KEY: string;

    ARCAPTCHA_SITE_KEY: string;
    ARCAPTCHA_SECRET_KEY: string;

    MEILI_MASTER_KEY: string;
    MEILI_HOST: string;
    NEXT_PUBLIC_MEILI_SEARCH_KEY:string;
}

export const environmentVariables: EnvironmentVariables = {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    AUTH_SECRET: process.env.AUTH_SECRET!,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST as "true" | "false",

    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    POSTGRES_DB: process.env.POSTGRES_DB!,
    POSTGRES_PORT: process.env.POSTGRES_PORT!,

    APP_PORT: process.env.APP_PORT!,

    PRISMA_SKIP_POSTINSTALL_GENERATE:
        process.env.PRISMA_SKIP_POSTINSTALL_GENERATE as "true" | "false",
    PRISMA_SCHEMA_ENGINE_BINARY: process.env.PRISMA_SCHEMA_ENGINE_BINARY!,
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING:
        process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING as "0" | "1",

    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID!,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET!,

    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,

    ARVANCLOUD_ENDPOINT: process.env.ARVANCLOUD_ENDPOINT!,
    ARVANCLOUD_GET_ENDPOINT: process.env.ARVANCLOUD_GET_ENDPOINT!,
    ARVANCLOUD_BUCKET_NAME: process.env.ARVANCLOUD_BUCKET_NAME!,
    ARVANCLOUD_ACCESS_KEY: process.env.ARVANCLOUD_ACCESS_KEY!,
    ARVANCLOUD_SECRET_KEY: process.env.ARVANCLOUD_SECRET_KEY!,

    ARCAPTCHA_SITE_KEY: process.env.ARCAPTCHA_SITE_KEY!,
    ARCAPTCHA_SECRET_KEY: process.env.ARCAPTCHA_SECRET_KEY!,

    MEILI_MASTER_KEY: process.env.MEILI_MASTER_KEY!,
    MEILI_HOST: process.env.MEILI_HOST!,
    NEXT_PUBLIC_MEILI_SEARCH_KEY: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY!
};
