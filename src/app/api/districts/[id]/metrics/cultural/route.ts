import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = {
      eventAttendance: 89,
      culturalSiteVisits: 1205,
      communityEngagement: 86,
      socialCohesion: 92,
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cultural metrics" },
      { status: 500 }
    );
  }
}
