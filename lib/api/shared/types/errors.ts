import { APIErrorCodes } from "../enums/ErrorCodes";

interface APIError extends Error {
  name: APIErrorCodes;
  message: string;
}

export class UnAuthenticatedError implements APIError {
  name = APIErrorCodes.authentication.UNAUTHORIZED;
  message: string = "The user was not authenticated";
}

export class UnAuthorizedError implements APIError {
  name = APIErrorCodes.authorization.INSUFFICIENT_PERMISSIONS;
  message: string = "The user is not authorized to do that";
}
