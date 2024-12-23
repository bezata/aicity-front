import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let url = `${API_URL}/districts/search?query=${encodeURIComponent(query)}`;
    if (type) {
      url += `&type=${type}`;
    }
    if (status) {
      url += `&status=${status}`;
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
      { error: "Failed to search districts" },
      { status: 500 }
    );
  }
}
