import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/districts/${params.id}/chatrooms`);
    const chatrooms = await response.json();
    return NextResponse.json(chatrooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch district chatrooms" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${API_URL}/districts/${params.id}/chatrooms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const chatroom = await response.json();
    return NextResponse.json(chatroom);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create chatroom" },
      { status: 500 }
    );
  }
}
