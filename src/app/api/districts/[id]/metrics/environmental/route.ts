import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const metrics = {
    airQuality: 92 + Math.random() * 5,
    noiseLevel: 45 + Math.random() * 10,
    crowdingLevel: 68 + Math.random() * 15,
    greenSpaceUsage: 78 + Math.random() * 10,
  }

  return NextResponse.json(metrics)
}

