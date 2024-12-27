import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chatroomId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "50";
    const before = searchParams.get("before");

    let url = `${API_URL}/districts/${params.id}/chatrooms/${params.chatroomId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }

    const response = await fetch(url);
    const messages = await response.json();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; chatroomId: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${API_URL}/districts/${params.id}/chatrooms/${params.chatroomId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const message = await response.json();
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
