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
