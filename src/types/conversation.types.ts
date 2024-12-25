export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isAgent?: boolean;
  };
  timestamp: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isAgent?: boolean;
}
