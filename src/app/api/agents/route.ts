import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/agents`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agentId1, agentId2 } = await request.json();
    const res = await fetch(
      `${process.env.BACKEND_URL}/agents/interact/${agentId1}/${agentId2}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to trigger agent interaction:", error);
    return NextResponse.json(
      { error: "Failed to trigger agent interaction" },
      { status: 500 }
    );
  }
}
