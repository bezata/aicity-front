export interface ChatMessage {
  content: string;
  style?: string;
  topics?: string[];
  sentiment?: number;
}

export interface ChatResponse {
  content: string;
}
