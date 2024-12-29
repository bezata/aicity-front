import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      success: true,
      data: [
        {
          id: "a42ed892-3878-45a5-9a1a-4ceaf9524f1c",
          name: "Downtown District",
          type: "mixed",
          population: 31000,
          metrics: {
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
          },
          socialMetrics: {
            communityEngagement: 0.7,
            culturalDiversity: 0.8,
            socialCohesion: 0.75,
            publicServices: 0.7,
            index: 0.75,
          },
          amenities: {
            schools: 1,
            hospitals: 3,
            parks: 3,
            shops: 25,
          },
        },
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}
