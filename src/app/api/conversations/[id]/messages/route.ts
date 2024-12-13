// src/app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${params.id}/messages`;

    const response = await fetch(new URL(apiUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.text();
      try {
        const jsonError = JSON.parse(errorData);
        throw new Error(jsonError.message || "Failed to send message");
      } catch {
        throw new Error(
          errorData || `Failed to send message (${response.status})`
        );
      }
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Message send error:", error);
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to send message",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
