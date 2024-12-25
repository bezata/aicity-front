"use client";

import { useParams, useRouter } from "next/navigation";
import { ChatRooms } from "@/components/chat-rooms";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/main-layout";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <MainLayout>
      <div className="container mx-auto h-full py-6">
        <ChatRooms />
      </div>
    </MainLayout>
  );
}
