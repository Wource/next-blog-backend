import { ZodError } from "zod";
import { APIErrorCodes } from "../enums/ErrorCodes";
import { UnAuthenticatedError, UnAuthorizedError } from "../types/errors";
import { Response } from "../types/response_schema/base";
import { NextResponse } from "next/server";

export const ErrorResponse = (error: any) => {
  if (error instanceof UnAuthenticatedError) {
    return Response.unauthorized(
      "User needs to be authenticated to preform this action",
      APIErrorCodes.authentication.UNAUTHORIZED,
    );
  }
  if (error instanceof UnAuthorizedError) {
    return Response.unauthorized(
      "Does not have the permission to do that",
      APIErrorCodes.authorization.INSUFFICIENT_PERMISSIONS,
    );
  }
  if (error instanceof ZodError) {
    return Response.badRequest(
      error.message,
      APIErrorCodes.validation.INVALID_INPUT,
    );
  }

  console.error("Error creating blog:", error);
  return Response.serverError(
    error.toString(),
    APIErrorCodes.server.INTERNAL_SERVER_ERROR,
  );
};
