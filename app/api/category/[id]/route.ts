import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import { NextRequest } from "next/server";
import { Blog } from "@/lib/api/blog/schema/schema";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import { CategoryGetResponse } from "@/lib/api/category/schema/get/schema";
import { CategoryDeleteResponse } from "@/lib/api/category/schema/delete/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") ?? "en";
    const fallbackLang = "en";
    const id = (await params).id;

    if (!id) {
      return Response.badRequest(
        "Invalid category ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language: { in: [lang, fallbackLang] } },
          select: { language: true, name: true, id: true },
        },
        blogs: {
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
        },
      },
    });

    if (!category) {
      return Response.notFound(
        "Category not found",
        APIErrorCodes.notFound.CATEGORY_NOT_FOUND,
      );
    }

    const catPreferred = category.translations.find((t) => t.language === lang);
    const catFallback = category.translations.find(
      (t) => t.language === fallbackLang,
    );

    const formattedBlogs: Blog[] = category.blogs.map((blog) => {
      const preferred = blog.translations.find((t) => t.language === lang);
      const fallback = blog.translations.find((t) => t.language === fallbackLang);

      const catPreferred = blog.category.translations.find(
        (t) => t.language === lang,
      );
      const catFallback = blog.category.translations.find(
        (t) => t.language === fallbackLang,
      );

      return {
        id: blog.id,
        slug: blog.slug ?? "",
        thumbnail: blog.thumbnail ?? "",
        viewCount: blog.viewCount ?? 0,
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
        metaDescription: blog.metaDescription,
        description:
          preferred?.description ||
          fallback?.description ||
          "No description available",
      };
    });

    return Response.ok<CategoryGetResponse>({
      id: category.id,
      name: catPreferred?.name || catFallback?.name || "Uncategorized",
      createdAt: category.createdAt.toISOString(),
      blogs: formattedBlogs,
    });
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "BlogCategory", "DELETE");

    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid category ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const category = await prisma.blogCategory.findUnique({ where: { id } });
    if (!category) {
      return Response.notFound(
        "Category not found",
        APIErrorCodes.notFound.CATEGORY_NOT_FOUND,
      );
    }

    await prisma.blogCategory.delete({ where: { id } });

    return Response.ok<CategoryDeleteResponse>({}, "Category deleted");
  } catch (error) {
    return ErrorResponse(error);
  }
}
