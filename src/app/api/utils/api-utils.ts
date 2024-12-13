// src/lib/api-utils.ts
import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = "APIError";
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) {
    throw new APIError("API URL not configured");
  }

  const url = `${baseURL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      try {
        const jsonError = JSON.parse(errorData);
        throw new APIError(
          jsonError.error || jsonError.message,
          response.status
        );
      } catch {
        throw new APIError(
          errorData || `HTTP error! status: ${response.status}`,
          response.status
        );
      }
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : "Failed to fetch",
      500
    );
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error);
  const status = error instanceof APIError ? error.status : 500;
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return NextResponse.json({ error: message }, { status });
}
