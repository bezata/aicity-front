import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.BACKEND_API_URL;
const apiKey = process.env.BACKEND_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let url = `${API_URL}/districts/${params.id}/events`;
    if (type || status) {
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      if (status) queryParams.append("status", status);
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    const events = await response.json();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch district events" },
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
    const response = await fetch(`${API_URL}/districts/${params.id}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "x-api-key": apiKey }),
      },
      body: JSON.stringify(body),
    });
    const event = await response.json();
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create district event" },
      { status: 500 }
    );
  }
}
