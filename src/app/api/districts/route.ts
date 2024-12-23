import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = "http://localhost:3001/api";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/districts`);
    const districts = await response.json();
    return NextResponse.json(districts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_URL}/districts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const district = await response.json();
    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create district" },
      { status: 500 }
    );
  }
}
