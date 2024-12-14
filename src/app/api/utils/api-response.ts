import { APIError } from "./types";

export class APIResponse {
  static success<T>(data: T, status: number = 200) {
    return Response.json(data, { status });
  }

  static error(error: unknown, status: number = 500) {
    const errorResponse: APIError = {
      error: error instanceof Error ? error.message : "Unknown error",
      message: error instanceof Error ? error.stack : String(error),
    };
    return Response.json(errorResponse, { status });
  }
}
