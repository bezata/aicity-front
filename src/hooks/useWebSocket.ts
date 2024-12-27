"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// WebSocket connection states
type ConnectionState = "connecting" | "connected" | "disconnected" | "failed";

// Interface for queued messages
interface QueuedMessage {
  id: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface WebSocketOptions {
  onMessage?: (data: any) => void;
}

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  // Connection states
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [connected, setConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<number>(100);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(Date.now());
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [latency, setLatency] = useState<number>(0);

  // Refs for WebSocket and timers
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueueRef = useRef<QueuedMessage[]>([]);
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Configuration constants
  const CONFIG = {
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    pingInterval: 15000,
    heartbeatTimeout: 30000,
    qualityCheckInterval: 5000,
    maxMessageQueueSize: 50,
    maxMessageRetries: 3,
    messageRetryDelay: 2000,
  };

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    Object.values(timeoutRefs.current).forEach((timeout) =>
      clearTimeout(timeout)
    );
    timeoutRefs.current = {};
  }, []);

  // Process message queue
  const processMessageQueue = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    const queue = messageQueueRef.current;

    queue.forEach((message, index) => {
      if (message.timestamp + CONFIG.messageRetryDelay < now) {
        if (message.retries < CONFIG.maxMessageRetries) {
          try {
            wsRef.current?.send(JSON.stringify(message.data));
            message.retries++;
            message.timestamp = now;
          } catch (error) {
            console.error("Failed to send queued message:", error);
          }
        } else {
          // Remove failed message after max retries
          queue.splice(index, 1);
        }
      }
    });
  }, []);

  // Monitor connection quality
  const checkConnectionQuality = useCallback(() => {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeat;
    const timeSinceLastActivity = now - lastActivity;

    let quality = 100;

    // Deduct points for various issues
    if (timeSinceLastHeartbeat > CONFIG.heartbeatTimeout / 2) quality -= 30;
    if (timeSinceLastActivity > CONFIG.heartbeatTimeout) quality -= 20;
    if (latency > 200) quality -= Math.min(30, (latency - 200) / 10);
    quality -= messageQueueRef.current.length * 2;

    setConnectionQuality(Math.max(0, Math.min(100, quality)));
  }, [lastHeartbeat, lastActivity, latency]);

  // Handle reconnection
  const handleReconnect = useCallback(() => {
    if (reconnectAttempt >= CONFIG.maxReconnectAttempts) {
      setConnectionState("failed");
      return;
    }

    const delay = CONFIG.reconnectDelay * Math.pow(2, reconnectAttempt);
    timeoutRefs.current.reconnect = setTimeout(() => {
      setReconnectAttempt((prev) => prev + 1);
      connectWebSocket();
    }, delay);
  }, [reconnectAttempt]);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    try {
      const apiKey = process.env.BACKEND_API_KEY;
      const wsUrl = apiKey ? `${url}?api_key=${apiKey}` : url;
      wsRef.current = new WebSocket(wsUrl);
      setConnectionState("connecting");

      // Set connection timeout
      timeoutRefs.current.connection = setTimeout(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          wsRef.current?.close();
          handleReconnect();
        }
      }, 5000);

      // WebSocket event handlers
      wsRef.current.onopen = () => {
        clearTimeout(timeoutRefs.current.connection);
        setConnected(true);
        setConnectionState("connected");
        setReconnectAttempt(0);
        setLastHeartbeat(Date.now());
        setLastActivity(Date.now());

        // Start ping interval
        timeoutRefs.current.ping = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const pingTimestamp = Date.now();
            wsRef.current.send(
              JSON.stringify({
                type: "ping",
                timestamp: pingTimestamp,
              })
            );
          }
        }, CONFIG.pingInterval);

        // Start quality monitoring
        timeoutRefs.current.quality = setInterval(
          checkConnectionQuality,
          CONFIG.qualityCheckInterval
        );

        // Process any queued messages
        processMessageQueue();
      };

      wsRef.current.onclose = (event: CloseEvent) => {
        console.log(
          `WebSocket disconnected - Code: ${event.code}, Reason: ${
            event.reason || "No reason provided"
          }`
        );
        clearAllTimeouts();
        setConnected(false);
        setConnectionState("disconnected");
        setConnectionQuality(0);

        if (
          event.code !== 1000 &&
          reconnectAttempt < CONFIG.maxReconnectAttempts
        ) {
          handleReconnect();
        }
      };

      wsRef.current.onerror = (event: Event) => {
        console.error("WebSocket error:", event);
        setConnectionQuality((prev) => Math.max(0, prev - 20));
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setLastActivity(Date.now());

          if (data.type === "pong") {
            const messageLatency = Date.now() - data.timestamp;
            setLatency(messageLatency);
            setLastHeartbeat(Date.now());
            updateConnectionQuality(messageLatency);
            return;
          }

          // Call the provided message handler
          if (options.onMessage) {
            options.onMessage(data);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      handleReconnect();
    }
  }, [url, reconnectAttempt, options.onMessage]);

  // Update connection quality based on latency
  const updateConnectionQuality = (messageLatency: number) => {
    setConnectionQuality((prev) => {
      if (messageLatency < 100) return Math.min(100, prev + 5);
      if (messageLatency < 200) return prev;
      return Math.max(0, prev - 5);
    });
  };

  // Send message with queue support
  const sendMessage = useCallback((message: any) => {
    const messageData = {
      ...message,
      timestamp: Date.now(),
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(messageData));
        return true;
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }

    // Queue message if send fails or not connected
    if (messageQueueRef.current.length < CONFIG.maxMessageQueueSize) {
      messageQueueRef.current.push({
        id: Date.now().toString(),
        data: messageData,
        timestamp: Date.now(),
        retries: 0,
      });
    }

    return false;
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((data: any) => {
    // Implement your message handling logic here
    console.log("Received message:", data);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    connectWebSocket();

    return () => {
      clearAllTimeouts();
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  return {
    connectionState,
    connected,
    connectionQuality,
    reconnectAttempt,
    latency,
    sendMessage,
    messageQueue: messageQueueRef.current,
    wsRef: wsRef.current,
  };
}
