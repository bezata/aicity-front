"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/types/conversation.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, Send, Users } from "lucide-react";
import { Session } from "@/lib/data";
import { Participant } from "@/types/conversation.types";

interface SessionViewerProps {
  session: Session & {
    participantsDetails: Participant[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionViewer({
  session,
  open,
  onOpenChange,
}: SessionViewerProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "Neural pathway optimization initiated for sector 7-G",
      sender: {
        id: "agent1",
        name: "Quantum Mind Alpha",
        avatar: "/placeholder.svg?height=40&width=40",
        isAgent: true,
      },
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      content: "Quantum coherence levels stabilized at 98.3%",
      sender: {
        id: "agent2",
        name: "Neural Entity Beta",
        avatar: "/placeholder.svg?height=40&width=40",
        isAgent: true,
      },
      timestamp: "1 minute ago",
    },
  ]);
  const [newMessage, setNewMessage] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming messages for live sessions
  React.useEffect(() => {
    if (session.status === "live") {
      const interval = setInterval(() => {
        const agentMessages = [
          "Analyzing neural response patterns...",
          "Quantum state coherence maintained at optimal levels",
          "Initiating deep learning sequence in neural cluster 5",
          "Synaptic connections showing 95% efficiency",
          "Processing quantum entanglement data streams",
        ];

        const randomAgent = session.participantsDetails.find((p) => p.isAgent);
        if (randomAgent) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content:
                agentMessages[Math.floor(Math.random() * agentMessages.length)],
              sender: {
                id: randomAgent.id,
                name: randomAgent.name,
                avatar: randomAgent.avatar,
                isAgent: true,
              },
              timestamp: "Just now",
            },
          ]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: "user",
        name: "Observer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "live":
        return "border-green-400/30 bg-green-500/10 text-green-300";
      case "scheduled":
        return "border-blue-400/30 bg-blue-500/10 text-blue-300";
      case "completed":
        return "border-purple-400/30 bg-purple-500/10 text-purple-300";
      default:
        return "border-purple-400/30 bg-purple-500/10 text-purple-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-purple-500/10 bg-black/90 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="font-light tracking-wider">
                {session.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{session.titleJp}</p>
            </div>
            <Badge variant="outline" className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_200px] gap-4">
          <div className="space-y-4">
            <ScrollArea
              ref={scrollRef}
              className="h-[400px] rounded-md border border-purple-500/10 bg-black/20 p-4"
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender.isAgent ? "" : "flex-row-reverse"
                    }`}
                  >
                    <Avatar className="border-2 border-black/30">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback className="bg-purple-500/10 text-purple-300">
                        {message.sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`space-y-1 ${
                        message.sender.isAgent ? "" : "text-right"
                      }`}
                    >
                      <p className="text-sm font-medium text-purple-300">
                        {message.sender.name}
                        <span className="ml-2 text-xs text-purple-300/50">
                          {message.timestamp}
                        </span>
                      </p>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          message.sender.isAgent
                            ? "bg-purple-500/10 text-purple-300"
                            : "bg-blue-500/10 text-blue-300"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-purple-500/10 bg-black/20 text-purple-300 placeholder:text-purple-300/50"
              />
              <Button
                type="submit"
                className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-purple-500/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-300">
                  Participants ({session.participantsDetails.length})
                </span>
              </div>
              <ScrollArea className="h-[200px] mt-4">
                <div className="space-y-3">
                  {session.participantsDetails.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8 border-2 border-black/30">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-purple-500/10 text-purple-300">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-purple-300">
                          {participant.name}
                        </p>
                        <p className="text-xs text-purple-300/70">
                          {participant.role}
                        </p>
                      </div>
                      {participant.isAgent && (
                        <Badge
                          variant="outline"
                          className="ml-auto border-purple-400/30 bg-purple-500/10 text-purple-300"
                        >
                          <Brain className="mr-1 h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {session.status === "live" && (
              <div className="rounded-lg border border-green-500/10 bg-green-500/5 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-300">
                    Live Session
                  </span>
                </div>
                <p className="mt-2 text-xs text-green-300/70">
                  This session is currently active. You can participate in
                  real-time discussions.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
