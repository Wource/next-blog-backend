import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import {
  categoryCreateZodSchema,
  CategoryCreateResponse,
} from "@/lib/api/category/schema/create/schema";
import { CategoryListResponse } from "@/lib/api/category/schema/list/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "BlogCategory", "CREATE");

    const body = await req.json();
    const { translations } = await categoryCreateZodSchema.parseAsync(body);

    for (const { language, name } of translations) {
      const exists = await prisma.blogCategoryTranslation.findFirst({
        where: { language, name },
      });

      if (exists) {
        return Response.conflict(
          `Category with name "${name}" already exists in language "${language}"`,
          APIErrorCodes.conflict.CATEGORY_ALREADY_EXISTS,
        );
      }
    }

    const category = await prisma.blogCategory.create({
      data: {
        translations: {
          create: translations.map(({ language, name }) => ({
            language,
            name,
          })),
        },
      },
      include: { translations: true },
    });

    return Response.created<CategoryCreateResponse>(category);
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") ?? "en";

    const categories = await prisma.blogCategory.findMany({
      include: { translations: true },
      orderBy: { id: "asc" },
    });

    const formattedCategories = categories.map((cat) => {
      const translation =
        cat.translations.find((t) => t.language === lang) ??
        cat.translations.find((t) => t.language === "en") ??
        cat.translations[0];
      return {
        id: cat.id,
        name: translation?.name ?? "Uncategorized",
        createdAt: cat.createdAt.toISOString(),
      };
    });

    return Response.ok<CategoryListResponse>(formattedCategories);
  } catch (error) {
    return ErrorResponse(error);
  }
}
