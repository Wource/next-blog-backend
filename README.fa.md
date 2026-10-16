# نکست‌بلاگ (NexBlog)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Free Software](https://img.shields.io/badge/Freedom-Free%20Software-brightgreen.svg)](https://www.gnu.org/philosophy/free-sw.html)

> 🌐 این سند را به زبان [English](README.md) بخوانید

**نکست‌بلاگ** یک نرم‌افزار آزاد است — یک API بک‌اند برای پلتفرم وبلاگ و محتوای چندزبانه که با Next.js ساخته شده است. شما آزادید آن را تحت شرایط [مجوز MIT](LICENSE) استفاده، مطالعه، تغییر و توزیع کنید.

## ویژگی‌ها

- **محتوای چندزبانه** — وبلاگ‌ها و دسته‌بندی‌ها با ترجمه‌ی جداگانه برای هر زبان و سازوکار جایگزین (`?lang=fa`، سپس `en`، سپس اولین ترجمه‌ی موجود)
- **مدیریت وبلاگ و دسته‌بندی** — عملیات CRUD با صفحه‌بندی، تولید خودکار اسلاگ و چرخه‌ی وضعیت (`pending` / `approved` / `rejected`)
- **کاتالوگ** — اندپوینت‌های محصول و برند
- **دیدگاه‌ها** — ثبت دیدگاه به‌همراه مدیریت (تغییر وضعیت / پاسخ)
- **احراز هویت و مجوز دسترسی** — ورود با ایمیل و رمز عبور به‌همراه کنترل دسترسی نقش‌محور (نقش مدیر دسترسی کامل دارد)
- **ذخیره‌سازی فایل** — آپلود سازگار با S3 (MinIO) با URL امضاشده، فهرست فایل‌ها و حذف
- **API یکپارچه و اعتبارسنجی‌شده** — اعتبارسنجی ورودی با Zod و قالب یکسان پاسخ `{ success, data, message }`

## فناوری‌ها

| لایه | فناوری |
| -------- | ---------- |
| فریم‌ورک | Next.js 16 (App Router) + React 19 |
| زبان | TypeScript (حالت strict) |
| ORM / دیتابیس | Prisma 7 + PostgreSQL 17 |
| احراز هویت | Better Auth (ایمیل و رمز عبور، افزونه‌ی مدیر) |
| ذخیره‌سازی | MinIO (سازگار با S3) با AWS SDK v3 |
| اعتبارسنجی | Zod |
| استایل | Tailwind CSS 4 |
| لینت | ESLint 9 |

## شروع به کار

### پیش‌نیازها

- Node.js نسخه‌ی ۲۰ یا بالاتر
- Docker (برای PostgreSQL و MinIO)

### راه‌اندازی

۱. مخزن را کلون کنید:
   ```bash
   git clone <repository_url>
   cd nexblog-backend
   ```
۲. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
۳. متغیرهای محیطی را تنظیم کنید:
   ```bash
   cp env.example .env
   ```
   سپس فایل `.env` را ویرایش کنید (بخش [متغیرهای محیطی](#متغیرهای-محیطی) را ببینید).
۴. زیرساخت را اجرا کنید:
   ```bash
   docker compose up minio postgres
   ```
۵. سرور توسعه را اجرا کنید:
   ```bash
   npm run dev
   ```

### اسکریپت‌ها

| دستور | توضیح |
| ------- | ----------- |
| `npm run dev` | اجرای سرور توسعه |
| `npm run build` | بیلد نسخه‌ی نهایی |
| `npm run start` | اجرای سرور نسخه‌ی نهایی |
| `npm run lint` | اجرای ESLint |

## متغیرهای محیطی

| متغیر | توضیح |
| -------- | ----------- |
| `DATABASE_URL` | رشته‌ی اتصال PostgreSQL |
| `BETTER_AUTH_SECRET` | کلید محرمانه‌ی نشست‌های احراز هویت |
| `BETTER_AUTH_URL` | آدرس عمومی برنامه |
| `MINIO_ENDPOINT` | آدرس S3 (مثلاً `http://localhost:9000`) |
| `MINIO_ACCESS_KEY` | کلید دسترسی S3 |
| `MINIO_SECRET_KEY` | کلید محرمانه‌ی S3 |
| `MINIO_BUCKET_NAME` | نام باکت آپلودها |
| `MINIO_API_CORS_ALLOW_ORIGIN` | مبدأ مجاز CORS برای آپلود |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | مشخصات مدیر اولیه |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | مشخصات Postgres در Docker |

قالب کامل را در فایل `env.example` ببینید.

## مرور API

اندپوینت‌های فهرست از صفحه‌بندی با `?page=1&limit=10` پشتیبانی می‌کنند (حداکثر `limit=100`).

| متد | اندپوینت | توضیح |
| ------ | -------- | ----------- |
| GET / POST | `/api/blog` | فهرست (صفحه‌بندی‌شده) / ساخت وبلاگ |
| GET / DELETE | `/api/blog/:id` | وبلاگ تکی (با `?lang=`) / حذف |
| GET / POST | `/api/category` | فهرست / ساخت دسته‌بندی |
| GET / DELETE | `/api/category/:id` | دسته‌بندی تکی (همراه وبلاگ‌ها) / حذف |
| GET / POST | `/api/product` | فهرست / ساخت محصول |
| GET | `/api/product/:id` | محصول تکی |
| GET / POST | `/api/brand` | فهرست / ساخت برند |
| GET | `/api/brand/:id` | برند تکی |
| GET / POST | `/api/comment` | فهرست / ثبت دیدگاه |
| GET / DELETE | `/api/comment/:id` | دیدگاه تکی / حذف |
| POST | `/api/comment/:id/status` | مدیریت وضعیت دیدگاه |
| POST | `/api/comment/:id/respond` | پاسخ به دیدگاه |
| POST | `/api/storage/presigned` | ساخت URL امضاشده‌ی آپلود |
| GET | `/api/storage/list-files` | فهرست فایل‌های ذخیره‌شده |
| POST | `/api/storage/delete` | حذف فایل‌های ذخیره‌شده |

مسیرهای نیازمند احراز هویت، خطاها را به‌صورت استاندارد با `APIErrorCodes` برمی‌گردانند (خطای اعتبارسنجی، احراز هویت، سرور).

## ساختار پروژه

```
app/api/
  blog/            — عملیات CRUD وبلاگ (+ [id])
  category/        — عملیات CRUD دسته‌بندی (+ [id])
  product/         — اندپوینت‌های محصول (+ [id])
  brand/           — اندپوینت‌های برند (+ [id])
  comment/         — دیدگاه‌ها (+ [id]، status، respond)
  storage/         — presigned، list-files، delete
lib/
  config.ts        — اینترفیس تایپ‌شده‌ی متغیرهای محیطی
  api/shared/      — احراز هویت، کلاینت Prisma، S3، اسکیماهای Zod، نگهبان RBAC، مدیریت خطا
  api/blog/        — اسکیماهای دامنه‌ی وبلاگ
  api/storage/     — توابع کمکی رسانه در S3
```

## مشارکت

مشارکت شما خوش‌آمد است — این یک نرم‌افزار آزاد است و ورودی جامعه آن را بهتر می‌کند.

۱. مخزن را فورک کنید
۲. برای تغییر خود یک برنچ بسازید
۳. `npm run lint` را اجرا کنید و از موفق بودن `npm run build` مطمئن شوید
۴. یک pull request با توضیح تغییر خود باز کنید

## مجوز

نکست‌بلاگ نرم‌افزار آزادی است که تحت [مجوز MIT](LICENSE) منتشر شده است — © 2026 Wource. شما آزادید آن را استفاده، تغییر و توزیع کنید، به شرطی که اعلان‌های کپی‌رایت و مجوز حفظ شوند.
