import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "10";
    const before = searchParams.get("before");

    let url = `${API_URL}/districts/${params.id}/activities?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
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
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
