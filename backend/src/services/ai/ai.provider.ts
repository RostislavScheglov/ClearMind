export interface ChatMessage {
  role: string;
  content: string;
}

export interface AIProvider {
  chat(messages: ChatMessage[], systemPrompt: string): Promise<string>;
}
