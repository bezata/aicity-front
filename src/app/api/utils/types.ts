export interface APIError {
  error: string;
  message?: string;
}

export interface Agent {
  id: string;
  name: string;
  personality: string;
  systemPrompt: string;
  interests: string[];
  preferredStyle: string;
}

export interface CreateAgentRequest {
  name: string;
  personality: string;
  systemPrompt: string;
  interests: string[];
  preferredStyle: string;
}

export interface ChatMessage {
  content: string;
  style?: string;
  topics?: string[];
  sentiment?: number;
}

export interface ChatResponse {
  content: string;
}
