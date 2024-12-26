"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Search,
  MapPin,
  ChevronRight,
  Building2,
  Globe,
  CircuitBoardIcon as Circuit,
  Users,
  MessageCircle,
} from "lucide-react";

interface District {
  id: string;
  name: string;
  nameJp: string;
  type: "quantum" | "cultural" | "research" | "residential";
  population: number;
  status: "active" | "busy" | "peaceful";
  icon: any;
  description: string;
  chatRoomId: string;
}

export function DistrictNavigation() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/conversations");
        const data = await response.json();

        // Transform conversation data to match District interface
        const transformedData: District[] = data.map((conv: any) => ({
          id: conv.id,
          name: conv.location,
          nameJp: conv.topic,
          type: "cultural",
          population: conv.participants.length,
          status: "active",
          icon: Brain,
          description: `${conv.activity} - ${conv.participants
            .map((p: any) => p.name)
            .join(", ")}`,
          chatRoomId: conv.id,
        }));

        setDistricts(transformedData);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDistricts, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredDistricts = districts.filter(
    (district) =>
      district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.nameJp.includes(searchQuery)
  );

  const getStatusColor = (status: District["status"]) => {
    switch (status) {
      case "active":
        return "text-green-400 border-green-400/30 bg-green-500/10";
      case "busy":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-500/10";
      case "peaceful":
        return "text-blue-400 border-blue-400/30 bg-blue-500/10";
      default:
        return "text-purple-400 border-purple-400/30 bg-purple-500/10";
    }
  };

  return (
    <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/50" />
            <Input
              placeholder="Search districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-purple-500/10 bg-black/20 font-light text-purple-300 placeholder:text-purple-300/50"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {filteredDistricts.map((district) => (
                <div
                  key={district.id}
                  className="group rounded-lg border border-purple-500/10 bg-black/30 p-4 transition-all hover:bg-purple-500/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <district.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-purple-300">
                              {district.name}
                            </h3>
                            <p className="text-sm text-purple-300/70">
                              {district.nameJp}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(district.status)}
                          >
                            {district.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-purple-300/50">
                          {district.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-purple-300/70">
                          <Users className="h-4 w-4" />
                          <span>
                            {district.population.toLocaleString()} participants
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            onClick={() =>
                              router.push(`/chat/${district.chatRoomId}`)
                            }
                          >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            onClick={() =>
                              router.push(`/districts/${district.id}`)
                            }
                          >
                            Enter
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
