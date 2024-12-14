import { NextRequest } from "next/server";
import { fetchAPI } from "@/app/api/utils/api-utils";
import { APIResponse } from "@/app/api/utils/api-response";
import { ChatMessage, ChatResponse } from "../../../utils/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string; agentId: string } }
) {
  try {
    const body = (await req.json()) as ChatMessage;

    // Validate request
    if (!body.content?.trim()) {
      return APIResponse.error("Message content is required", 400);
    }

    const data = await fetchAPI<ChatResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/send-message/${params.conversationId}/${params.agentId}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return APIResponse.success(data);
  } catch (error) {
    return APIResponse.error(error);
  }
}
