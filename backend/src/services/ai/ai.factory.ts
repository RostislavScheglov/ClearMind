import { AIProvider } from './ai.provider';
import { OpenRouterProvider } from './openrouter.provider';

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!providerInstance) {
    providerInstance = new OpenRouterProvider();
  }
  return providerInstance;
}
