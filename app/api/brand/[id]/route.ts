import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import { BrandDeleteResponse } from "@/lib/api/brand/schema/delete/schema";

// DELETE /api/brand/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    CheckAuthorization(session, "Brand", "DELETE");

    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid brand ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const existingBrand = await prisma.brand.findUnique({ where: { id } });
    if (!existingBrand) {
      return Response.notFound(
        "Brand not found",
        APIErrorCodes.notFound.NOT_FOUND,
      );
    }

    await prisma.brand.delete({ where: { id } });

    return Response.ok<BrandDeleteResponse>(
      { deletedBrandId: id },
      "Brand deleted successfully",
    );
  } catch (error) {
    return ErrorResponse(error);
  }
}
