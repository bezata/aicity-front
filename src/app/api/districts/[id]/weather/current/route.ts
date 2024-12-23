import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real implementation, this would fetch from a weather service
  const weather = {
    temperature: 22 + Math.random() * 5,
    feelsLike: 23 + Math.random() * 5,
    humidity: 65 + Math.random() * 10,
    precipitation: Math.random() * 5,
    windSpeed: 12 + Math.random() * 8,
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    airQuality: 85 + Math.random() * 10,
  }

  return NextResponse.json(weather)
}

