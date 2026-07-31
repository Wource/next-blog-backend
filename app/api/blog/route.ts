import { NextRequest } from "next/server";
import slugify from "slugify";
import { blogInputSchema } from "@/lib/api/shared/infrastructure/zod";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { BlogCreateResponse } from "@/lib/api/blog/schema/create/schema";
import { BlogListResponse } from "@/lib/api/blog/schema/list/schema";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import { Blog } from "@/lib/api/blog/schema/schema";

export async function POST(request: NextRequest) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Blog", "CREATE");

    const body = await request.json();
    const { categoryId, translations, thumbnail, metaDescription } =
      await blogInputSchema.parseAsync(body);

    // Check category
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return Response.notFound(
        "Category not found",
        APIErrorCodes.notFound.CATEGORY_NOT_FOUND,
      );
    }

    // Ensure no duplicate titles per language
    for (const t of translations) {
      const existing = await prisma.blogTranslation.findFirst({
        where: { title: t.title, language: t.language },
      });
      if (existing) {
        return Response.conflict(
          `A blog with this title already exists in "${t.language}"`,
          APIErrorCodes.conflict.DUPLICATE_ENTRY,
        );
      }
    }

    // Generate slug from the first translation
    const slug = slugify(translations[0].title, { lower: true, strict: true });

    // Ensure slug uniqueness
    const slugExists = await prisma.blog.findUnique({ where: { slug } });
    if (slugExists) {
      return Response.conflict(
        "A blog with this slug already exists",
        APIErrorCodes.conflict.SLUG_ALREADY_EXISTS,
      );
    }

    const defaultTranslation =
      translations.find((t) => t.language === "en") || translations[0];

    // Create blog
    await prisma.blog.create({
      data: {
        title: defaultTranslation.title,
        content: defaultTranslation.content,
        slug,
        thumbnail,
        metaDescription,
        categoryId,
        status: "approved",
        translations: {
          create: translations.map((t) => ({
            language: t.language,
            title: t.title,
            content: t.content,
            description: t.description,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return Response.created<BlogCreateResponse>({});
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;
    const lang = searchParams.get("lang") || "en";
    const fallbackLang = "en";

    const totalCount = await prisma.blog.count();

    const blogs = await prisma.blog.findMany({
      skip,
      take: limit,
      include: {
        translations: {
          where: { language: { in: [lang, fallbackLang] } },
          select: {
            language: true,
            title: true,
            content: true,
            description: true,
          },
        },
        category: {
          include: {
            translations: {
              where: { language: { in: [lang, fallbackLang] } },
              select: { language: true, name: true, id: true },
            },
            _count: { select: { blogs: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedBlogs: Blog[] = blogs.map((blog) => {
      // fallback
      const preferred = blog.translations.find((t) => t.language === lang);
      const fallback = blog.translations.find(
        (t) => t.language === fallbackLang,
      );

      // category fallback
      const catPreferred = blog.category.translations.find(
        (t) => t.language === lang,
      );
      const catFallback = blog.category.translations.find(
        (t) => t.language === fallbackLang,
      );

      return {
        id: blog.id,
        slug: blog.slug,
        thumbnail: blog.thumbnail,
        viewCount: blog.viewCount,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
        category: {
          id: catPreferred?.id || catFallback?.id || "",
          name: catPreferred?.name || catFallback?.name || "Uncategorized",
          categorySize: blog.category._count.blogs,
        },
        title: preferred?.title || fallback?.title || "Untitled",
        content:
          preferred?.content || fallback?.content || "No content available",
        description:
          preferred?.description ||
          fallback?.description ||
          "No Description available",
        metaDescription: blog.metaDescription,
      };
    });

    return Response.ok<BlogListResponse>({
      blogs: formattedBlogs,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
}
