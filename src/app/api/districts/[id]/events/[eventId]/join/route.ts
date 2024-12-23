import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

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
