import { NextRequest } from "next/server";
import { prisma } from "@/lib/api/shared/infrastructure/prisma";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import CheckAuthorization from "@/lib/api/shared/services/CheckAuthorization";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { APIErrorCodes } from "@/lib/api/shared/enums/ErrorCodes";
import {
  commentRespondZodSchema,
  CommentRespondResponse,
} from "@/lib/api/comment/schema/respond";
import { formatComment } from "@/lib/api/comment/formatComment";

// POST /api/comment/[id]/respond - Admin only
// Only allows responding to top-level comments (1 level of nesting max)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await CheckAuthentication();
    await CheckAuthorization(session, "Comment", "CREATE", "status");

    const id = (await params).id;
    if (!id) {
      return Response.badRequest(
        "Invalid comment ID",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    // Check that the parent comment exists
    const parentComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!parentComment) {
      return Response.notFound(
        "Comment not found",
        APIErrorCodes.notFound.COMMENT_NOT_FOUND,
      );
    }

    // Only allow responding to top-level comments (no nested replies)
    if (parentComment.parentId !== null) {
      return Response.badRequest(
        "Cannot reply to a reply. Only top-level comments can be responded to.",
        APIErrorCodes.validation.INVALID_INPUT,
      );
    }

    const body = await request.json();
    const { content } = await commentRespondZodSchema.parseAsync(body);

    // Create a reply as the admin user, with status approved automatically
    const responseComment = await prisma.comment.create({
      data: {
        content,
        blogId: parentComment.blogId,
        userId: session.user.id,
        parentId: id,
        status: "approved",
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return Response.created<CommentRespondResponse>(
      formatComment(responseComment),
      "Response added successfully",
    );
  } catch (error) {
    return ErrorResponse(error);
  }
}
