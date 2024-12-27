"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    nameJp: string;
    role: string;
    avatar: string;
    isAgent?: boolean;
  };
  timestamp: string;
}

interface Session {
  id: string;
  departmentId: string;
  title: string;
  titleJp: string;
  participants: number;
  startTime: string;
  status: "live" | "scheduled" | "completed";
  participantsDetails: {
    id: string;
    name: string;
    nameJp: string;
    role: string;
    avatar: string;
    isAgent?: boolean;
  }[];
  messages?: Message[];
}

interface SessionViewerProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionViewer({
  session,
  open,
  onOpenChange,
}: SessionViewerProps) {
  const [messages, setMessages] = React.useState<Message[]>(
    session.messages?.map((msg: any) => ({
      id: msg.id,
      content: (msg.content || "")
        .replace("[Your Name]", "")
        .replace(/^"|"$/g, "")
        .trim(),
      sender: {
        id: msg.sender.id,
        name: msg.sender.name
          ? msg.sender.name.charAt(0).toUpperCase() + msg.sender.name.slice(1)
          : msg.sender.id.charAt(0).toUpperCase() + msg.sender.id.slice(1),
        nameJp: msg.sender.nameJp,
        role: msg.sender.role,
        avatar: msg.sender.avatar,
        isAgent: msg.sender.isAgent,
      },
      timestamp: msg.timestamp,
    })) || []
  );
  const [newMessage, setNewMessage] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || session.status === "completed") return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: "user",
        name: "Observer",
        nameJp: "オブザーバー",
        role: "Observer",
        avatar: "/placeholder.svg?height=40&width=40",
        isAgent: false,
      },
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-purple-500/10 bg-black/90 text-purple-50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-light tracking-wider">
              {session.title}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "border-purple-400/30 bg-purple-500/10",
                session.status === "completed"
                  ? "border-gray-400/30 bg-gray-500/10 text-gray-300"
                  : session.status === "live"
                  ? "border-green-400/30 bg-green-500/10 text-green-300"
                  : "text-purple-300"
              )}
            >
              {session.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>{session.titleJp}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <ScrollArea className="h-[400px] rounded-lg border border-purple-500/10 bg-black/20 p-4">
            <div className="space-y-4" ref={scrollRef}>
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-purple-300">
                      {message.sender.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                    >
                      {message.sender.role}
                    </Badge>
                    <span className="text-xs text-purple-300/50">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-purple-300/70">
                    {message.sender.nameJp}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                session.status === "completed"
                  ? "This session has ended"
                  : "Type your message..."
              }
              className="border-purple-500/10 bg-black/20 text-purple-300 placeholder:text-purple-300/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={session.status === "completed"}
            />
            <Button
              onClick={handleSendMessage}
              disabled={session.status === "completed"}
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
