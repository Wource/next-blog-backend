import { NextRequest } from "next/server";
import slugify from "slugify";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import {
  productCreateZodSchema,
  ProductCreateResponse,
} from "@/lib/api/product/schema/create/schema";
import { ProductListResponse } from "@/lib/api/product/schema/list/schema";
import { Product } from "@/lib/api/product/schema/schema";

// POST /api/product
export async function POST(request: NextRequest) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Product", "CREATE");

    const body = await request.json();
    const { translations, thumbnail, images } =
      await productCreateZodSchema.parseAsync(body);

    // Ensure no duplicate titles per language
    for (const t of translations) {
      const existing = await prisma.productTranslation.findFirst({
        where: { title: t.title, language: t.language },
      });
      if (existing) {
        return Response.conflict(
          `A product with this title already exists in "${t.language}"`,
          APIErrorCodes.conflict.DUPLICATE_ENTRY,
        );
      }
    }

    // Generate slug from the first translation
    const slug = slugify(translations[0].title, { lower: true, strict: true });

    // Ensure slug uniqueness
    const slugExists = await prisma.product.findUnique({ where: { slug } });
    if (slugExists) {
      return Response.conflict(
        "A product with this slug already exists",
        APIErrorCodes.conflict.SLUG_ALREADY_EXISTS,
      );
    }

    // Create product
    await prisma.product.create({
      data: {
        slug,
        thumbnail,
        images,
        status: "approved",
        translations: {
          create: translations.map((t) => ({
            language: t.language,
            title: t.title,
            content: t.content,
            description: t.description,
            metaDescription: t.metaDescription,
            specifications: t.specifications ?? undefined,
            nutritionalValue: t.nutritionalValue ?? undefined,
          })),
        },
      },
    });

    return Response.created<ProductCreateResponse>({});
  } catch (error) {
    return ErrorResponse(error);
  }
}

// GET /api/product?page=1&limit=10&lang=en
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

    const totalCount = await prisma.product.count();

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: { translations: true },
      orderBy: { createdAt: "desc" },
    });

    const formattedProducts: Product[] = products.map((product) => ({
      id: product.id,
      slug: product.slug,
      thumbnail: product.thumbnail,
      images: product.images,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      ...pickTranslation(product.translations, lang),
    }));

    return Response.ok<ProductListResponse>({
      products: formattedProducts,
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

function pickTranslation(
  translations: {
    language: string;
    title: string;
    content: string;
    description: string;
    metaDescription: string;
    specifications: unknown;
    nutritionalValue: unknown;
  }[],
  lang: string,
): Pick<
  Product,
  | "title"
  | "description"
  | "content"
  | "metaDescription"
  | "specifications"
  | "nutritionalValue"
> {
  const active =
    translations.find((t) => t.language === lang) ??
    translations.find((t) => t.language === "en") ??
    translations[0];

  const asKeyValue = (value: unknown) =>
    Array.isArray(value)
      ? (value as Product["specifications"]).filter(
          (item) => typeof item?.key === "string" && typeof item?.value === "string",
        )
      : [];

  return {
    title: active?.title || "Untitled",
    description: active?.description || "No description available",
    content: active?.content || "No content available",
    metaDescription: active?.metaDescription || "",
    specifications: asKeyValue(active?.specifications),
    nutritionalValue: asKeyValue(active?.nutritionalValue),
  };
}
