import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const emergency = {
    level: Math.random() > 0.9 ? "warning" : "normal",
    activeIncidents: Math.floor(Math.random() * 5),
    responseTeamsAvailable: 8 - Math.floor(Math.random() * 3),
  }

  return NextResponse.json(emergency)
}

