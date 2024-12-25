import ws from "ws";
import { headers } from "next/headers";
import type { Socket } from "net";

let wss: ws.Server | null = null;

interface ExtWebSocket extends ws {
  isAlive: boolean;
  heartbeatInterval?: NodeJS.Timeout;
}

// Keep track of recently processed messages to prevent duplicates
const recentMessages = new Set<string>();
const MESSAGE_CACHE_TIME = 5000; // 5 seconds

function cleanupOldMessages() {
  setTimeout(() => {
    recentMessages.clear();
  }, MESSAGE_CACHE_TIME);
}

function initWebSocketServer() {
  if (wss) return wss;

  wss = new ws.Server({
    noServer: true,
    clientTracking: true, // Enable built-in client tracking
  });

  const heartbeat = (socket: ExtWebSocket) => {
    socket.isAlive = true;
  };

  wss.on("connection", (socket: ExtWebSocket) => {
    socket.isAlive = true;
    console.log("Client connected");

    // Set up heartbeat check
    socket.heartbeatInterval = setInterval(() => {
      if (!socket.isAlive) {
        clearInterval(socket.heartbeatInterval);
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    }, 30000);

    socket.on("pong", () => heartbeat(socket));

    socket.on("message", (message: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const messageStr = message.toString();
        const messageData = JSON.parse(messageStr);
        const messageId = `${messageData.timestamp}-${messageData.content}`;

        // Check if we've already processed this message
        if (recentMessages.has(messageId)) {
          return;
        }

        // Add to recent messages and schedule cleanup
        recentMessages.add(messageId);
        cleanupOldMessages();

        console.log("Broadcasting message:", messageId);

        // Broadcast to all clients except sender
        let broadcastCount = 0;
        wss?.clients.forEach((client: ws) => {
          if (client !== socket && client.readyState === ws.OPEN) {
            client.send(messageStr);
            broadcastCount++;
          }
        });

        console.log(`Message broadcast to ${broadcastCount} clients`);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("close", () => {
      console.log("Client disconnected");
      if (socket.heartbeatInterval) {
        clearInterval(socket.heartbeatInterval);
      }
    });

    socket.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
      if (socket.heartbeatInterval) {
        clearInterval(socket.heartbeatInterval);
      }
    });
  });

  return wss;
}

export async function GET(req: Request) {
  const headersList = headers();
  const upgrade = headersList.get("upgrade");

  if (!upgrade || upgrade !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  try {
    const webSocketServer = initWebSocketServer();
    const { socket: res } = process as any;
    const socket: Socket = res?.socket?.socket || res?.socket;

    if (!socket) {
      throw new Error("Failed to get server socket");
    }

    webSocketServer.handleUpgrade(
      req as any,
      socket,
      Buffer.alloc(0),
      (ws: ws) => {
        webSocketServer.emit("connection", ws);
      }
    );

    return new Response(null, {
      status: 101,
      headers: {
        Upgrade: "websocket",
        Connection: "Upgrade",
      },
    });
  } catch (err) {
    console.error("WebSocket upgrade error:", err);
    return new Response("WebSocket upgrade error", { status: 500 });
  }
}
