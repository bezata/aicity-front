import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.BACKEND_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const response = await fetch(
      `${API_URL}/districts/${params.id}/events/${params.eventId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "x-api-key": apiKey }),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join event" },
      { status: 500 }
    );
  }
}
