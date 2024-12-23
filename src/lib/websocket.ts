export class MetricsWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private lastHeartbeat: number = Date.now();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private isConnecting: boolean = false;
  private isDisconnecting: boolean = false;
  private readonly HEARTBEAT_INTERVAL = 15000; // 15 seconds
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30 seconds

  constructor(
    private districtId: string,
    private onMessage: (data: any) => void,
    private onError?: (error: any) => void,
    private onConnected?: () => void,
    private onDisconnected?: () => void
  ) {
    this.connect();
  }

  private connect() {
    if (
      this.isConnecting ||
      this.ws?.readyState === WebSocket.CONNECTING ||
      this.ws?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    this.isConnecting = true;
    try {
      const wsUrl = `ws://localhost:3001/api/districts/${this.districtId}/live`;
      console.log("Connecting to WebSocket:", wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected successfully");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.lastHeartbeat = Date.now();
        this.startHeartbeat();
        this.onConnected?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "heartbeat") {
            this.lastHeartbeat = Date.now();
            // Respond to heartbeat immediately
            this.send({ type: "heartbeat", timestamp: Date.now() });
          } else {
            this.handleMessage(data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          this.onError?.(error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.onDisconnected?.();
        if (!this.isDisconnecting && event.code !== 1000) {
          this.handleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.onError?.(error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.isConnecting = false;
      this.onError?.(error);
      this.handleReconnect();
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case "initial":
        console.log("Received initial metrics:", data.data);
        this.onMessage(data);
        break;
      case "metrics":
        this.onMessage(data);
        break;
      case "heartbeat":
        // Heartbeat is handled in onmessage
        break;
      default:
        this.onMessage(data);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing interval

    // Send initial heartbeat
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({ type: "heartbeat", timestamp: Date.now() });
    }

    this.heartbeatInterval = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat;
      if (timeSinceLastHeartbeat > this.HEARTBEAT_TIMEOUT) {
        console.warn(
          `No heartbeat received for ${timeSinceLastHeartbeat}ms, reconnecting...`
        );
        this.reconnect();
      } else {
        // Send heartbeat
        this.send({ type: "heartbeat", timestamp: Date.now() });
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect() {
    this.stopHeartbeat();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.connect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.onError?.(new Error("Max reconnection attempts reached"));
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const backoffTime = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000
    );
    console.log(`Reconnecting in ${backoffTime}ms...`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(
        `Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      this.connect();
    }, backoffTime);
  }

  public send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public disconnect() {
    this.isDisconnecting = true;
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this.isDisconnecting = false;
  }
}
