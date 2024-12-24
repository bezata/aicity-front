import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = {
      populationCount: 15234,
      activeEntities: 12453,
      visitorCount: 892,
      peakHoursStatus: "Optimal",
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vitals" },
      { status: 500 }
    );
  }
}
