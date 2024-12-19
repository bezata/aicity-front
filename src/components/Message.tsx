"use client";

interface MessageProps {
  sender: string;
  content: string;
  avatar: {
    initial: string;
    color: string;
  };
}

export function Message({ sender, content, avatar }: MessageProps) {
  return (
    <div className="flex items-start space-x-3">
      <div
        className={`flex-shrink-0 w-8 h-8 ${avatar.color} rounded-full 
                   flex items-center justify-center text-white font-medium`}
      >
        {avatar.initial}
      </div>
      <div className="flex-1">
        <div className="text-sm text-zinc-400 mb-1">{sender}</div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-zinc-200">
          {content}
        </div>
      </div>
    </div>
  );
}
