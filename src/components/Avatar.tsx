import { FC } from 'react';

interface AvatarProps {
  initial: string;
  color: string;
}

export const Avatar: FC<AvatarProps> = ({ initial, color }) => (
  <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
    <span className="text-xs text-white font-medium">{initial}</span>
  </div>
);

