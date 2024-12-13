"use client";

import { useState, useEffect, useRef } from "react";
import { Cloud, Sun } from "lucide-react";
import { Message } from "./Message";

interface ConversationState {
  momentum: number;
  currentStyle: string;
  emotionalState: number;
  timeOfDay: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

const agents = [
  {
    id: "luna",
    name: "Luna",
    avatar: { initial: "L", color: "bg-indigo-600" },
  },
  {
    id: "atlas",
    name: "Atlas",
    avatar: { initial: "A", color: "bg-purple-600" },
  },
];

export default function ChatInterface() {
  const [currentWeather, setCurrentWeather] = useState<"rain" | "sun">("rain");
  const [conversationMood, setConversationMood] = useState(0.7);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`conv-${Date.now()}`);
  const currentAgent = useRef(agents.find(a => a.id === "luna")); // Default to Luna

  useEffect(() => {
    fetchConversationState();
    const stateInterval = setInterval(fetchConversationState, 5000);
    return () => clearInterval(stateInterval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversationState = async () => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId.current}/state`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const state: ConversationState = await response.json();

      // Add null checks
      if (state && typeof state.momentum === "number") {
        setConversationMood(state.momentum);
      }
      if (state && state.timeOfDay) {
        setCurrentWeather(state.timeOfDay.includes("rain") ? "rain" : "sun");
      }
    } catch (error) {
      console.error("Failed to fetch conversation state:", error);
    }
  };

  const streamResponse = async (agentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/chat/${conversationId.current}/${agentId}`
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: data.content },
          ];
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "assistant",
            content: data.content,
            role: "assistant",
            timestamp: Date.now(),
          },
        ];
      });
    } catch (error) {
      console.error("Response error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to the UI immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "You",
        content: inputMessage,
        role: "user",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");

      // Check if we need to switch agents based on message content
      const message = userMessage.content.toLowerCase();
      if (message.includes("luna")) {
        currentAgent.current = agents.find(a => a.id === "luna");
      } else if (message.includes("atlas")) {
        currentAgent.current = agents.find(a => a.id === "atlas");
      }

      // Send message to the chat API
      const response = await fetch(
        `/api/chat/${conversationId.current}/${currentAgent.current?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationId: conversationId.current,
            agentId: currentAgent.current?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Update messages with the full history
      const history = data.history.map((msg: any) => ({
        id: msg.id,
        sender: msg.role === "user" ? "You" : agents.find(a => a.id === msg.agentId)?.name || "Luna",
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp,
      }));

      setMessages(history);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Sidebar - Same as before */}
      <div className="w-64 border-r border-zinc-800 p-4 flex flex-col">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-zinc-100">AI Chatroom</h1>
          <div className="text-sm text-zinc-400">Connected Agents</div>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-800/50"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="text-zinc-200">{agent.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Status Bar - Same as before but with real data */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
          {/* ... Status bar content ... */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-zinc-400">Mood</div>
              <div className="w-24 h-2 bg-zinc-800 rounded-full">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${conversationMood * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-zinc-400">Weather</div>
              {currentWeather === "rain" ? (
                <Cloud className="w-6 h-6 text-blue-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              sender={message.sender}
              content={message.content}
              avatar={
                message.sender === "You"
                  ? { initial: "Y", color: "bg-green-600" }
                  : agents.find((agent) => agent.name === message.sender)
                      ?.avatar || { initial: "?", color: "bg-gray-600" }
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="h-24 border-t border-zinc-800 p-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && handleSendMessage()
              }
              placeholder={
                isLoading ? "Waiting for response..." : "Send a message..."
              }
              disabled={isLoading}
              className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
