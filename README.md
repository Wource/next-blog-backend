# NexBlog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Free Software](https://img.shields.io/badge/Freedom-Free%20Software-brightgreen.svg)](https://www.gnu.org/philosophy/free-sw.html)

> 🌐 Read this in [فارسی](README.fa.md)

**NexBlog** is free software — a backend API for a multi-language blog and content platform built with Next.js. You are free to use, study, modify, and distribute it under the terms of the [MIT License](LICENSE).

## Features

- **Multilingual content** — blogs and categories with per-language translations and fallback (`?lang=en`, falls back to `en`, then first available)
- **Blog & category management** — CRUD with pagination, slug generation, status workflow (`pending` / `approved` / `rejected`)
- **Catalog** — product and brand endpoints
- **Comments** — submission plus moderation (status / respond actions)
- **Authentication & authorization** — email + password auth with role-based access control (admin bypass)
- **File storage** — S3-compatible uploads (MinIO) via presigned URLs, file listing, and deletion
- **Validated, consistent API** — Zod request validation and a uniform `{ success, data, message }` response shape

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| ORM / DB | Prisma 7 + PostgreSQL 17 |
| Auth | Better Auth (email + password, admin plugin) |
| Storage | MinIO (S3-compatible) via AWS SDK v3 |
| Validation | Zod |
| Styling | Tailwind CSS 4 |
| Lint | ESLint 9 |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL + MinIO)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd nexblog-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp env.example .env
   ```
   Then edit `.env` (see [Environment Variables](#environment-variables)).
4. Start the infrastructure:
   ```bash
   docker compose up minio postgres
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for auth sessions |
| `BETTER_AUTH_URL` | Public base URL of the app |
| `MINIO_ENDPOINT` | S3 endpoint (e.g. `http://localhost:9000`) |
| `MINIO_ACCESS_KEY` | S3 access key |
| `MINIO_SECRET_KEY` | S3 secret key |
| `MINIO_BUCKET_NAME` | Bucket name for uploads |
| `MINIO_API_CORS_ALLOW_ORIGIN` | Allowed CORS origin for uploads |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | Initial admin seed credentials |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Docker Postgres credentials |

See `env.example` for a complete template.

## API Overview

Paginated list endpoints accept `?page=1&limit=10` (max `limit=100`).

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET / POST | `/api/blog` | List (paginated) / create blogs |
| GET / DELETE | `/api/blog/:id` | Single blog (`?lang=` fallback) / delete |
| GET / POST | `/api/category` | List / create categories |
| GET / DELETE | `/api/category/:id` | Single category (with blogs) / delete |
| GET / POST | `/api/product` | List / create products |
| GET | `/api/product/:id` | Single product |
| GET / POST | `/api/brand` | List / create brands |
| GET | `/api/brand/:id` | Single brand |
| GET / POST | `/api/comment` | List / submit comments |
| GET / DELETE | `/api/comment/:id` | Single comment / delete |
| POST | `/api/comment/:id/status` | Moderate comment status |
| POST | `/api/comment/:id/respond` | Respond to a comment |
| POST | `/api/storage/presigned` | Generate presigned upload URL |
| GET | `/api/storage/list-files` | List stored files |
| POST | `/api/storage/delete` | Delete stored objects |

Authenticated routes return standardized errors via a central handler with `APIErrorCodes` (validation, auth, server).

## Project Structure

```
app/api/
  blog/            — Blog CRUD (+ [id])
  category/        — Category CRUD (+ [id])
  product/         — Product endpoints (+ [id])
  brand/           — Brand endpoints (+ [id])
  comment/         — Comments (+ [id], status, respond)
  storage/         — presigned, list-files, delete
lib/
  config.ts        — Typed env interface
  api/shared/      — Auth, Prisma client, S3, Zod schemas, RBAC guard, error handling
  api/blog/        — Blog domain schemas
  api/storage/     — S3 media helpers
```

## Contributing

Contributions are welcome — this is free software and community input makes it better.

1. Fork the repository
2. Create a branch for your change
3. Run `npm run lint` and verify `npm run build` passes
4. Open a pull request describing your change

## License

NexBlog is free software released under the [MIT License](LICENSE) — © 2026 Wource. You may use, modify, and distribute it freely, provided the copyright and license notices are preserved.
