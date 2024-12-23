"use client";

import { useParams, useRouter } from "next/navigation";
import ChatRooms from "@/components/chat-rooms";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/main-layout";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
        <div className="container max-w-7xl mx-auto py-6">
          <Button
            variant="ghost"
            className="mb-6 gap-2 text-purple-300 hover:text-purple-200"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <ChatRooms initialRoom={roomId} />
        </div>
      </div>
    </MainLayout>
  );
}
