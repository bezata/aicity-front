import { useEffect, useRef, useCallback } from "react";

interface UseWebSocketProps {
  url: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null);
  const messageQueue = useRef<Set<string>>(new Set());
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      onOpen?.();
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      onClose?.();

      // Attempt to reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    ws.current.onmessage = (event) => {
      // Prevent duplicate messages using a message queue with timestamps
      const messageId = `${event.data}-${Date.now()}`;

      if (!messageQueue.current.has(messageId)) {
        messageQueue.current.add(messageId);
        onMessage(event.data);

        // Remove message from queue after 5 seconds
        setTimeout(() => {
          messageQueue.current.delete(messageId);
        }, 5000);
      }
    };
  }, [url, onMessage, onOpen, onClose, onError]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return { sendMessage };
}
