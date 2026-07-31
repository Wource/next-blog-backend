import { NextResponse } from "next/server";
import { APIErrorCodes } from "../../enums/ErrorCodes";

export interface APIResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
  data?: object;
}

export interface APISuccessResponse extends APIResponse {
  data: object;
}

export interface APIErrorResponse extends APIResponse {
  success: false;
  message: string;
  errorCode: APIErrorCodes;
}

export class Response {
  // 200 OK
  static ok<T extends APISuccessResponse>(
    data: T['data'], 
    message = "Success"
  ) {
    const response: T = {
      success: true,
      data: data,
      message: message
    } as T;
    return NextResponse.json(response, { status: 200 });
  }

  // 201 Created
  static created<T extends APISuccessResponse>(
    data: T['data'], 
    message = "Resource created successfully"
  ) {
    const response: T = {
      success: true,
      data: data,
      message: message
    } as T;
    return NextResponse.json(response, { status: 201 });
  }

  // 200 OK - Updated
  static updated<T extends APISuccessResponse>(
    data: T['data'], 
    message = "Resource updated successfully"
  ) {
    const response: T = {
      success: true,
      data: data,
      message: message
    } as T;
    return NextResponse.json(response, { status: 200 });
  }

  // 204 No Content
  static noContent() {
    return new NextResponse(null, { status: 204 });
  }

  // 400 Bad Request
  static badRequest(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 400 });
  }

  // 401 Unauthorized
  static unauthorized(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 401 });
  }

  // 403 Forbidden
  static forbidden(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 403 });
  }

  // 404 Not Found
  static notFound(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 404 });
  }

  // 409 Conflict
  static conflict(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 409 });
  }

  // 422 Unprocessable Entity
  static unprocessableEntity(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 422 });
  }

  // 429 Too Many Requests
  static tooManyRequests(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 429 });
  }

  // 500 Internal Server Error
  static serverError(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 500 });
  }

  // 503 Service Unavailable
  static serviceUnavailable(message: string, errorCode: APIErrorCodes) {
    const response: APIErrorResponse = {
      success: false,
      message: message,
      errorCode: errorCode
    };
    return NextResponse.json(response, { status: 503 });
  }
}