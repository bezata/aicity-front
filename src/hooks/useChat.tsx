import { useState, useCallback, useRef } from "react";
import type { ConversationState, Message } from "@/types/conversation.types";

export function useChat(initialConversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ConversationState | null>(null);
  const conversationId = useRef(initialConversationId || `conv-${Date.now()}`);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const sendMessage = useCallback(
    async (content: string, agentId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${backendUrl}/ai/send-message/${conversationId.current}/${agentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ message: content }),
          }
        );

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages((prev) => [...prev, data]);
        return data;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [backendUrl]
  );

  const triggerAgentChat = useCallback(
    async (agentId1: string, agentId2: string) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId1, agentId2 }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages((prev) => [...prev, ...data]);
        return data;
      } catch (error) {
        console.error("Failed to trigger agent chat:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    state,
    sendMessage,
    triggerAgentChat,
    conversationId: conversationId.current,
  };
}
