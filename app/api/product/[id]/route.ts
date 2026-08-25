import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import { Product } from "@/lib/api/product/schema/schema";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import { ProductGetResponse } from "@/lib/api/product/schema/get/schema";
import { ProductDeleteResponse } from "@/lib/api/product/schema/delete/schema";

// GET /api/product/[id] — single product with translation fallback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid product ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const lang = new URL(request.url).searchParams.get("lang") || "en";

    const product = await prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!product) {
      return Response.notFound(
        "Product not found",
        APIErrorCodes.notFound.NOT_FOUND,
      );
    }

    const translations = product.translations;
    const active =
      translations.find((t) => t.language === lang) ??
      translations.find((t) => t.language === "en") ??
      translations[0];

    const asKeyValue = (value: unknown) =>
      Array.isArray(value)
        ? (value as Product["specifications"]).filter(
            (item) =>
              typeof item?.key === "string" && typeof item?.value === "string",
          )
        : [];

    const formattedProduct: Product = {
      id: product.id,
      slug: product.slug,
      thumbnail: product.thumbnail,
      images: product.images,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      title: active?.title || "Untitled",
      description: active?.description || "No description available",
      content: active?.content || "No content available",
      metaDescription: active?.metaDescription || "",
      specifications: asKeyValue(active?.specifications),
      nutritionalValue: asKeyValue(active?.nutritionalValue),
    };

    return Response.ok<ProductGetResponse>(formattedProduct);
  } catch (error) {
    return ErrorResponse(error);
  }
}

// DELETE /api/product/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Product", "DELETE");

    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid product ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return Response.notFound(
        "Product not found",
        APIErrorCodes.notFound.NOT_FOUND,
      );
    }

    await prisma.product.delete({ where: { id } });

    return Response.ok<ProductDeleteResponse>(
      { deletedProductId: id },
      "Product deleted successfully",
    );
  } catch (error) {
    return ErrorResponse(error);
  }
}
