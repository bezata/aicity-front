export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ConversationState {
  momentum: number;
  currentStyle: string;
  emotionalState: number;
  timeOfDay: string;
}
