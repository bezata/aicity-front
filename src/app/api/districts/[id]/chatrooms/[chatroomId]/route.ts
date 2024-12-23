import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chatroomId: string } }
) {
  try {
    const response = await fetch(
      `${API_URL}/districts/${params.id}/chatrooms/${params.chatroomId}`
    );
    const chatroom = await response.json();
    return NextResponse.json(chatroom);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chatroom" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; chatroomId: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${API_URL}/districts/${params.id}/chatrooms/${params.chatroomId}`,
      {
        method: "PUT",
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
      { error: "Failed to update chatroom" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; chatroomId: string } }
) {
  try {
    await fetch(
      `${API_URL}/districts/${params.id}/chatrooms/${params.chatroomId}`,
      {
        method: "DELETE",
      }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete chatroom" },
      { status: 500 }
    );
  }
}
