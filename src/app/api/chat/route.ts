import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId") || "default";

    const res = await fetch(
      `${process.env.BACKEND_URL}/chat/conversations/${conversationId}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      participants,
      content,
      conversationId = "default",
    } = await request.json();

    const res = await fetch(
      `${process.env.BACKEND_URL}/chat/group-chat/${conversationId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants, content }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send group message" },
      { status: 500 }
    );
  }
}
