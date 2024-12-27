import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/districts/${params.id}`);
    const district = await response.json();
    return NextResponse.json(district);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch district" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_URL}/districts/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const district = await response.json();
    return NextResponse.json(district);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update district" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await fetch(`${API_URL}/districts/${params.id}`, {
      method: "DELETE",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete district" },
      { status: 500 }
    );
  }
}
