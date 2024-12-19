"use client";

import { useRef, useState, useEffect } from "react";
import { Cloud, Sun, MessageSquare } from "lucide-react";
import { Message } from "./Message";
import { useChat } from "@/hooks/useChat";
import type { Agent } from "@/types/agent.types";

const agents: Agent[] = [
  {
    id: "luna",
    name: "Luna",
    avatar: { initial: "L", color: "bg-indigo-600" },
    personality: "Friendly and helpful",
    interests: ["technology", "art"],
    systemPrompt: "",
    preferredStyle: "casual",
    memoryWindowSize: 10,
    emotionalRange: { min: 0, max: 1 },
  },
  {
    id: "atlas",
    name: "Atlas",
    avatar: { initial: "A", color: "bg-purple-600" },
    personality: "Analytical and precise",
    interests: ["science", "data"],
    systemPrompt: "",
    preferredStyle: "formal",
    memoryWindowSize: 10,
    emotionalRange: { min: 0, max: 1 },
  },
];

export default function ChatInterface() {
  const { messages, isLoading, state, sendMessage, triggerAgentChat } =
    useChat();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAgent = useRef(agents.find((a) => a.id === "luna"));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      const messageToSend = inputMessage;
      setInputMessage("");

      const message = messageToSend.toLowerCase();
      if (message.includes("luna")) {
        currentAgent.current = agents.find((a) => a.id === "luna");
      } else if (message.includes("atlas")) {
        currentAgent.current = agents.find((a) => a.id === "atlas");
      }

      if (!currentAgent.current?.id) {
        console.error("No agent selected");
        return;
      }

      await sendMessage(messageToSend, currentAgent.current.id);

      if (message.includes("luna") && message.includes("atlas")) {
        setTimeout(async () => {
          await triggerAgentChat("luna", "atlas");
          setTimeout(async () => {
            await triggerAgentChat("atlas", "luna");
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Sidebar */}
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
          {/* Add agent interaction button */}
          <button
            onClick={async () => {
              if (messages.length > 0) {
                await triggerAgentChat("luna", "atlas");
                setTimeout(async () => {
                  await triggerAgentChat("atlas", "luna");
                }, 2000);
              }
            }}
            disabled={isLoading || messages.length === 0}
            className="w-full mt-4 px-4 py-2 bg-indigo-600/50 text-white rounded-lg 
                     hover:bg-indigo-700/50 transition-colors disabled:opacity-50 
                     disabled:hover:bg-indigo-600/50 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trigger Agent Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Status Bar */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-zinc-400">Mood</div>
              <div className="w-24 h-2 bg-zinc-800 rounded-full">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${state?.momentum ? state.momentum * 100 : 70}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-zinc-400">Weather</div>
              {state?.timeOfDay?.includes("rain") ? (
                <Cloud className="w-6 h-6 text-blue-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages?.map((message) => (
            <Message
              key={message.id}
              sender={
                message.role === "user"
                  ? "You"
                  : agents.find((a) => a.id === message.agentId)?.name ||
                    "Unknown"
              }
              content={message.content}
              avatar={
                message.role === "user"
                  ? { initial: "Y", color: "bg-green-600" }
                  : agents.find((a) => a.id === message.agentId)?.avatar || {
                      initial: "?",
                      color: "bg-gray-600",
                    }
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isLoading ? "Waiting for response..." : "Send a message..."
              }
              disabled={isLoading}
              className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 
                       text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 
                       focus:ring-indigo-500/50 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                       transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
