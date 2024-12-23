import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DistrictService } from "@/services/district.service";

const districtService = new DistrictService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analytics = await districtService.getDistrictAnalytics(params.id);
    if (!analytics) {
      return NextResponse.json(
        { error: "District analytics not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch district analytics" },
      { status: 500 }
    );
  }
}
