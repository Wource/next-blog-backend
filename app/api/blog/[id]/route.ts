import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import { Blog } from "@/lib/api/blog/schema/schema";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/api/shared/infrastructure/s3";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import { BlogGetResponse } from "@/lib/api/blog/schema/get/schema";
import { BlogDeleteResponse } from "@/lib/api/blog/schema/delete/schema";

// GET one blog with translations + fallback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid blog ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    const fallbackLang = "en";

    const blog = await prisma.blog.findUnique({
      where: { id },
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
              select: { language: true, name: true },
            },
            _count: { select: { blogs: true } },
          },
        },
      },
    });

    if (!blog) {
      return Response.notFound(
        "Blog not found",
        APIErrorCodes.notFound.POST_NOT_FOUND,
      );
    }

    // increase viewCount
    await prisma.blog.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const preferred = blog.translations.find((t) => t.language === lang);
    const fallback = blog.translations.find((t) => t.language === fallbackLang);

    const catPreferred = blog.category.translations.find(
      (t) => t.language === lang,
    );
    const catFallback = blog.category.translations.find(
      (t) => t.language === fallbackLang,
    );

    const formattedBlog: Blog = {
      id: blog.id,
      slug: blog.slug,
      thumbnail: blog.thumbnail,
      viewCount: blog.viewCount + 1,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
      category: {
        id: blog.category.id,
        name: catPreferred?.name || catFallback?.name || "Uncategorized",
        categorySize: blog.category._count.blogs,
      },
      title: preferred?.title || fallback?.title || "Untitled",
      content:
        preferred?.content || fallback?.content || "No content available",
      description:
        preferred?.description ||
        fallback?.description ||
        "No description available",
      metaDescription: blog.metaDescription,
    };

    return Response.ok<BlogGetResponse>(formattedBlog);
  } catch (error) {
    return ErrorResponse(error);
  }
}

// DELETE blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Blog", "DELETE");

    // Get blog ID
    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid blog ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    // Find blog with its category info
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            _count: { select: { blogs: true } },
          },
        },
      },
    });

    if (!existingBlog) {
      return Response.notFound(
        "Blog not found",
        APIErrorCodes.notFound.POST_NOT_FOUND,
      );
    }

    const categoryInfo = {
      id: existingBlog.category.id,
      categorySize: existingBlog.category._count.blogs,
    };

    // Delete blog from database
    await prisma.blog.delete({ where: { id } });

    // Delete thumbnail from S3 storage
    if (existingBlog.thumbnail) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: existingBlog.thumbnail,
        });
        await s3.send(command);
      } catch (error) {
        console.error("Error deleting thumbnail:", error);
        // Don't fail the entire operation if thumbnail deletion fails
      }
    }

    // Return success with category info
    return Response.ok<BlogDeleteResponse>(
      { deletedBlogId: id, category: categoryInfo },
      "Blog deleted successfully",
    );
  } catch (error) {
    return ErrorResponse(error);
  }
}
