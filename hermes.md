# Next Blog Backend

## Project Overview
A Next.js 16 backend API for a multi-language blog platform. Uses DDD-like architecture with Prisma ORM (PostgreSQL), Better Auth for authentication/authorization, MinIO (S3-compatible) for file storage, and Zod for request validation.

## Tech Stack
- **Framework:** Next.js 16 (App Router, `"type": "module"`)
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Auth:** Better Auth with admin plugin
- **Storage:** S3-compatible (MinIO) via AWS SDK v3
- **Validation:** Zod
- **Styling:** Tailwind CSS 4
- **Linting:** ESLint 9 (eslint-config-next, core-web-vitals + typescript)

## Commands
- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `docker compose up minio postgres` — Start dev infrastructure (PostgreSQL 17, MinIO)

## Project Structure
```
app/
  api/
    blog/route.ts              — Blog CRUD (POST, GET with pagination)
    blog/[id]/route.ts         — Single blog (GET with lang fallback, DELETE)
    category/route.ts          — Category CRUD (POST, GET)
    category/[id]/route.ts     — Single category (GET with blogs, DELETE)
    storage/presigned/route.ts — Generate presigned upload URLs
    storage/list-files/route.ts— List S3 files
    storage/delete/route.ts    — Delete S3 objects
  layout.tsx                   — Root layout (Geist fonts, Tailwind)
  page.tsx                     — Home page

lib/
  config.ts                    — Typed environment variables interface
  APIResponseInterfaces.ts     — Output DTOs (BlogOutput, Category, ProductOutput)

  api/
    shared/
      enums/ErrorCodes.ts      — APIErrorCodes enum (validation, auth, server, etc.)
      infrastructure/
        auth.ts                — Better Auth setup (email+password, admin plugin, session roles)
        prisma.ts              — Prisma client singleton (PrismaPg adapter)
        s3.ts                  — S3Client (MinIO, path-style)
        zod.ts                 — Shared Zod schemas (blog, category, product, auth)
        prisma/
          schema/
            schema.prisma      — Generator + datasource config
            auth.prisma        — User, Session, Account, Verification models
            blog.prisma        — Blog, BlogTranslation, BlogCategory, BlogCategoryTranslation
            enums.prisma       — Status, Role, MediaTypes enums
          generated/           — Prisma generated client (DO NOT EDIT)
          migrations/          — Migration history
      services/
        CheckAuthentication.ts — Validates session, throws UnAuthenticatedError
        CheckAuthorization.ts  — Validates role permissions via Gaurd
        ErrorResponse.ts       — Central error handler (auth, zod, server errors)
        gaurd.ts               — RBAC guard (role -> model -> actions mapping)
      types/
        errors.ts              — UnAuthenticatedError, UnAuthorizedError classes
        response_schema/
          base.ts              — Response helper class (ok, created, badRequest, etc.)
          pagination.ts        — APIResponsePagination interface

    blog/create/schema.ts      — Blog create request/response types (Zod + TypeScript)
    storage/storage.ts         — S3 media helpers (object keys, content types, presigned URLs)
```

## Architecture Patterns

### DDD-like Layering
- **`app/api/`** — Route handlers (thin controllers). Handle HTTP concerns only.
- **`lib/api/`** — Business logic, domain types, infrastructure.
- **`lib/api/shared/`** — Cross-cutting concerns (auth, validation, error handling, Prisma).
- **`lib/api/<domain>/`** — Domain-specific code (blog/create/schema.ts, storage/storage.ts).

### API Response Pattern
All responses follow a consistent shape:
```json
{
  "success": true|false,
  "data": { ... },
  "message": "optional"
}
```
Use the `Response` class from `lib/api/shared/types/response_schema/base` for standardized HTTP responses:
- `Response.ok(data)`, `Response.created(data)`, `Response.updated(data)`
- `Response.badRequest(msg, errorCode)`, `Response.unauthorized(msg, errorCode)`
- `Response.notFound(msg, errorCode)`, `Response.serverError(msg, errorCode)`

### Error Handling
- Routes wrap logic in try/catch
- Auth errors throw `UnAuthenticatedError` / `UnAuthorizedError`
- Validation errors caught via `ZodError`
- Central handler: `ErrorResponse(error)` in `lib/api/shared/services/ErrorResponse.ts`
- Errors carry `APIErrorCodes` (from `lib/api/shared/enums/ErrorCodes.ts`)

### Authentication & Authorization
- `CheckAuthentication()` — Verifies session exists, returns session or throws
- `CheckAuthorization(session, model, action)` — Checks RBAC via `Gaurd.can()`
- Admin role bypasses all permission checks
- Guard map: `role -> PrismaModel -> Action[]` (CREATE, READ, UPDATE, DELETE)

### Internationalization (i18n)
- Blog and Category models use translation tables (`BlogTranslation`, `BlogCategoryTranslation`)
- API accepts `?lang=en` query parameter
- Fallback chain: preferred language -> "en" -> first available translation
- Languages stored as 2-5 char codes (e.g., "en", "fa")

### Validation
- Zod schemas in `lib/api/shared/infrastructure/zod.ts` for shared schemas
- Domain-specific schemas in `lib/api/<domain>/<action>/schema.ts`
- Use `schema.parseAsync(body)` for throw-on-error, or `schema.safeParse(body)` for manual handling

## Database
- PostgreSQL 17 via Docker
- Prisma schema split into multiple files: `schema.prisma`, `auth.prisma`, `blog.prisma`, `enums.prisma`
- Prisma config: `prisma.config.ts` (schema path, migrations, datasource)
- Generated client output: `lib/api/shared/infrastructure/prisma/generated/`

### Key Models
- **User** — id, name, email, role (USER|ADMIN), sessions, accounts
- **Blog** — id, title, slug, content, thumbnail, status (pending|approved|rejected), categoryId, viewCount, translations
- **BlogCategory** — id, translations, blogs
- **BlogTranslation** — blogId, language, title, content, description
- **BlogCategoryTranslation** — categoryId, language, name

## Environment Variables
See `env.example` for required vars. Key ones:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Auth secret
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_NAME` — S3 storage

## Coding Conventions
- Use `@/*` path aliases (mapped to project root in tsconfig)
- Import from `@/lib/api/...` for all shared code
- Server-only files use `"server only"` directive at top
- Prisma client imported from `@/lib/api/shared/infrastructure/prisma`
- Route handlers export named functions matching HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Dynamic route params use `Promise<{ id: string }>` (Next.js 16 async params)
- Prefer `Response` class over raw `NextResponse.json()` for consistency
- Use `ErrorResponse(error)` as the catch handler in authenticated routes
- Slugify titles for URL-safe slugs
- Pagination: `?page=1&limit=10` (default page=1, limit=10, max limit=100)
