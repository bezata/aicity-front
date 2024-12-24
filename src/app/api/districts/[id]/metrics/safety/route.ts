import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = {
      overallScore: 95,
      recentIncidents: 3,
      responseTime: "2.5 min",
      serviceAvailability: 98,
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch safety metrics" },
      { status: 500 }
    );
  }
}
