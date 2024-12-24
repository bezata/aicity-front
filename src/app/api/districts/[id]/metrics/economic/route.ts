import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = {
      businessActivity: 88,
      growthRate: 4.2,
      activeTransactions: 1234,
      marketSentiment: "positive",
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch economic metrics" },
      { status: 500 }
    );
  }
}
