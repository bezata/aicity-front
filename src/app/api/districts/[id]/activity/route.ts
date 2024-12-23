import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const activity = {
    activeEvents: Math.floor(Math.random() * 5) + 10,
    ongoingMeetings: Math.floor(Math.random() * 3) + 4,
    collaborationSessions: Math.floor(Math.random() * 4) + 6,
    chatActivity: Math.random() > 0.5 ? "High" : "Medium",
  }

  return NextResponse.json(activity)
}

