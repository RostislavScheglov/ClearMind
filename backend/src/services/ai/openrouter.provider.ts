import { AIProvider, ChatMessage } from './ai.provider';
import { env } from '../../utils/env';
import { AppError } from '../../utils/AppError';

const FALLBACK_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-3-27b-it:free',
  'google/gemma-3-12b-it:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3.6-plus-preview:free',
];

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

export class OpenRouterProvider implements AIProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    this.apiKey = env.OPENROUTER_API_KEY;
    this.model = env.OPENROUTER_MODEL;
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const formattedMessages = [
      { role: 'user', content: `[System instructions]: ${systemPrompt}` },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Build model list: primary first, then fallbacks (deduped)
    const models = [this.model, ...FALLBACK_MODELS.filter((m) => m !== this.model)];

    for (const model of models) {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await this.tryRequest(model, formattedMessages);
          if (result) return result;
        } catch (err) {
          const isRateLimit = err instanceof RateLimitError;
          const isLast = attempt === MAX_RETRIES;

          if (isRateLimit && !isLast) {
            const delay = BASE_DELAY_MS * attempt;
            console.log(`[AI] ${model} rate-limited (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          if (isRateLimit) {
            console.log(`[AI] ${model} exhausted retries, trying next model...`);
            break; // try next model
          }

          // Non-rate-limit error — try next model
          console.error(`[AI] ${model} error:`, (err as Error).message);
          break;
        }
      }
    }

    throw new AppError(503, 'AI service unavailable — all models rate-limited. Please try again in a minute.');
  }

  private async tryRequest(
    model: string,
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': env.FRONTEND_URL,
          'X-Title': 'ClearMind',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new RateLimitError();
      }

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${body.substring(0, 200)}`);
      }

      const data = (await response.json()) as Record<string, unknown>;
      return this.extractContent(data);
    } catch (err) {
      if (err instanceof RateLimitError) throw err;
      if ((err as Error).name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  private extractContent(data: Record<string, unknown>): string {
    const choices = data.choices as Array<{ message?: { content?: string } }>;
    const content = choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('AI returned empty response');
    }
    return content;
  }
}

class RateLimitError extends Error {
  constructor() {
    super('Rate limited');
    this.name = 'RateLimitError';
  }
}
