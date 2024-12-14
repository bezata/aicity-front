import { APIError } from "./types";

export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
      cache: options?.cache ?? "no-store",
      next: {
        revalidate: 0,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `API request failed with status ${response.status}`
      );
    }

    return data as T;
  } catch (error) {
    const apiError: APIError = {
      error: error instanceof Error ? error.message : "Unknown error",
      message: error instanceof Error ? error.stack : String(error),
    };
    throw apiError;
  }
}

export function handleAPIError(error: unknown): APIError {
  return {
    error: error instanceof Error ? error.message : "Unknown error",
  };
}
