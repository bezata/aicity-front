import { FC } from 'react';
import { Avatar } from './Avatar';

interface MessageProps {
  sender: string;
  content: string;
  avatar: {
    initial: string;
    color: string;
  };
}

export const Message: FC<MessageProps> = ({ sender, content, avatar }) => (
  <div className="flex space-x-3">
    <Avatar initial={avatar.initial} color={avatar.color} />
    <div className="flex-1">
      <div className="bg-zinc-800/50 rounded-lg p-4 max-w-2xl">
        <div className="text-sm font-medium text-zinc-200 mb-1">{sender}</div>
        <div className="text-sm text-zinc-300">{content}</div>
      </div>
    </div>
  </div>
);

