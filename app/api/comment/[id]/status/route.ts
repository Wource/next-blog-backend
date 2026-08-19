import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import {
  commentStatusZodSchema,
  CommentStatusResponse,
} from "@/lib/api/comment/schema/status";
import { formatComment } from "@/lib/api/comment/formatComment";

// PATCH /api/comment/[id]/status - Admin only (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    await CheckAuthorization(session, "Comment", "UPDATE", "status");

    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid comment ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return Response.notFound(
        "Comment not found",
        APIErrorCodes.notFound.COMMENT_NOT_FOUND,
      );
    }

    const body = await request.json();
    const { status } = await commentStatusZodSchema.parseAsync(body);

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return Response.updated<CommentStatusResponse>(
      formatComment(updatedComment),
      `Comment ${status} successfully`,
    );
  } catch (error) {
    return ErrorResponse(error);
  }
}
