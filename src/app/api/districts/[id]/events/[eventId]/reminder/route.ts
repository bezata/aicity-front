import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const response = await fetch(
      `${API_URL}/districts/${params.id}/events/${params.eventId}/reminder`,
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
      { error: "Failed to set reminder" },
      { status: 500 }
    );
  }
}
