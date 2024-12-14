// app/api/agents/route.ts
import { NextRequest } from "next/server";
import { fetchAPI } from "../utils/api-utils";
import { APIResponse } from "../utils/api-response";
import { Agent, CreateAgentRequest } from "../utils/types";

export async function GET() {
  try {
    const data = await fetchAPI<Agent[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/agents`
    );
    return APIResponse.success(data);
  } catch (error) {
    return APIResponse.error(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAgentRequest;

    // Add validation here if needed
    if (!body.name || !body.systemPrompt) {
      return APIResponse.error("Missing required fields", 400);
    }

    const data = await fetchAPI<Agent>(
      `${process.env.NEXT_PUBLIC_API_URL}/agents`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return APIResponse.success(data, 201);
  } catch (error) {
    return APIResponse.error(error);
  }
}
