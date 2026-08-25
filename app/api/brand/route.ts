import { NextRequest } from "next/server";
import slugify from "slugify";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import {
  brandCreateZodSchema,
  BrandCreateResponse,
} from "@/lib/api/brand/schema/create/schema";
import { BrandListResponse } from "@/lib/api/brand/schema/list/schema";
import { Brand } from "@/lib/api/brand/schema/schema";

// POST /api/brand
export async function POST(request: NextRequest) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Brand", "CREATE");

    const body = await request.json();
    const { name, description, logo } =
      await brandCreateZodSchema.parseAsync(body);

    // Ensure name uniqueness
    const nameExists = await prisma.brand.findUnique({ where: { name } });
    if (nameExists) {
      return Response.conflict(
        `A brand with the name "${name}" already exists`,
        APIErrorCodes.conflict.DUPLICATE_ENTRY,
      );
    }

    // Generate slug from the name
    const slug = slugify(name, { lower: true, strict: true });

    // Ensure slug uniqueness
    const slugExists = await prisma.brand.findUnique({ where: { slug } });
    if (slugExists) {
      return Response.conflict(
        "A brand with this slug already exists",
        APIErrorCodes.conflict.SLUG_ALREADY_EXISTS,
      );
    }

    await prisma.brand.create({
      data: { name, slug, description, logo },
    });

    return Response.created<BrandCreateResponse>({});
  } catch (error) {
    return ErrorResponse(error);
  }
}

// GET /api/brand — list all brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formattedBrands: Brand[] = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo: brand.logo,
      createdAt: brand.createdAt.toISOString(),
    }));

    return Response.ok<BrandListResponse>({ brands: formattedBrands });
  } catch (error) {
    return ErrorResponse(error);
  }
}
