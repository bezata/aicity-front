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

    let url = `${API_URL}/districts/${params.id}/cultural-sites`;
    if (type) {
      url += `?type=${type}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cultural sites" },
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
      `${API_URL}/districts/${params.id}/cultural-sites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "x-api-key": apiKey }),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create cultural site" },
      { status: 500 }
    );
  }
}
