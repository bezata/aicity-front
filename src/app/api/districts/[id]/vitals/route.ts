import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const vitals = {
    populationCount: 15234 + Math.floor(Math.random() * 100),
    activeEntities: 12453 + Math.floor(Math.random() * 200),
    visitorCount: 892 + Math.floor(Math.random() * 50),
    peakHoursStatus: Math.random() > 0.7 ? "Busy" : "Optimal",
  }

  return NextResponse.json(vitals)
}

