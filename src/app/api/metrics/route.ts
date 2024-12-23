import { NextResponse } from "next/server";

const METRIC_ENDPOINTS = {
  weather: "weather/current",
  emergency: "emergency",
  vitals: "vitals",
  environmental: "metrics/environmental",
  community: "activity",
  safety: "metrics/safety",
  resources: "resources",
  transport: "transport",
  economic: "metrics/economic",
  cultural: "metrics/cultural",
  infrastructure: "infrastructure",
  budget: "budget",
  departments: "departments",
  donations: "donations",
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const metric = searchParams.get("metric");

    if (!metric || !METRIC_ENDPOINTS[metric as keyof typeof METRIC_ENDPOINTS]) {
      return NextResponse.json(
        { error: "Invalid metric type" },
        { status: 400 }
      );
    }

    const endpoint = METRIC_ENDPOINTS[metric as keyof typeof METRIC_ENDPOINTS];
    const response = await fetch(
      `${process.env.BACKEND_URL}/districts/${params.id}/${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

// WebSocket upgrade handler for real-time updates
export async function GET_WS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { socket, response } = await (WebSocket as any).upgradeWebSocket(request);
    const backendWs = new WebSocket(
      `${process.env.BACKEND_WS_URL}/districts/${params.id}/live`
    );

    // Forward messages from backend to client
    backendWs.onmessage = (event) => {
      socket.send(event.data);
    };

    // Forward messages from client to backend
    socket.onmessage = (event: any) => {
      backendWs.send(event.data);
    };

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to establish WebSocket connection" },
      { status: 500 }
    );
  }
}
