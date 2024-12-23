import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DistrictService } from "@/services/district.service";

const districtService = new DistrictService();

export async function GET() {
  try {
    const metrics = await districtService.getAllMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch all district metrics" },
      { status: 500 }
    );
  }
}
