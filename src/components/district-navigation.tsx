"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  MessageCircle,
  Activity,
  ChevronRight,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  personality: string;
  interests: string[];
}

interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  role: string;
  sentiment?: number;
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
  activity: string;
  location: string;
  topic: string;
  status: string;
  lastUpdateTime: number;
  isEnded: boolean;
}

export function DistrictNavigation() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch(
          `${process.env.BACKEND_API_URL}/api/conversations`,
          {
            headers: {
              "x-api-key": process.env.BACKEND_API_KEY || "",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        // Only keep active and not ended conversations
        setConversations(
          data.filter(
            (conv: Conversation) => conv.status === "active" && !conv.isEnded
          )
        );
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    fetchConversations();
    // Refresh every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.location.toLowerCase().includes(searchLower) ||
      conv.topic.toLowerCase().includes(searchLower) ||
      conv.activity.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search locations or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 border-purple-500/10 bg-black/20 text-purple-300 placeholder:text-purple-300/50"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <Card
                key={conv.id}
                className="border-purple-500/10 bg-black/20 transition-colors hover:bg-black/30"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">
                          {conv.location}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                      >
                        {conv.activity.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-purple-300/70">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{conv.topic.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{conv.participants.length} Participants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>
                          {new Date(conv.lastUpdateTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {conv.messages.length > 0 && (
                      <div className="rounded-md border border-purple-500/10 bg-purple-500/5 p-2 text-xs text-purple-300/70">
                        <p className="line-clamp-2">
                          {conv.messages[conv.messages.length - 1].content}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => router.push(`/chat/${conv.id}`)}
                      className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enter Chat
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
              <MessageCircle className="h-8 w-8 text-purple-400/50 mb-2" />
              <p className="text-sm text-purple-300/70">
                No active conversations at the moment
              </p>
              <p className="text-xs text-purple-300/50">
                Check back later for new discussions
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
