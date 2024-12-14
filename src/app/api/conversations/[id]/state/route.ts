import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/${params.id}/state`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch conversation state");
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
