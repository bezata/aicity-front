import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Simulated data - in a real app, this would come from a database or external API
    const data = {
      success: true,
      data: {
        safety: 0.8,
        cleanliness: 0.7,
        noise: 0.3,
        crowding: 0.4,
        ambiance: 0.7,
        education: 0.75,
        healthcare: 0.8,
        environment: 0.7,
        economicGrowth: 0.6,
        propertyValues: 0.7,
        businessActivity: 0.6,
        infrastructureQuality: 0.7,
        publicServiceAccess: 0.6,
        transportEfficiency: 0.7,
        culturalVibrancy: 0.8,
        communityWellbeing: 0.7,
        socialCohesion: 0.8,
        energyEfficiency: 0.7,
        greenSpaceCoverage: 0.6,
        environmentalHealth: 0.7,
        environmental: {
          airQuality: 50,
          noiseLevel: 45,
          waterQuality: 7,
          greenCoverage: 0.4,
        },
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
