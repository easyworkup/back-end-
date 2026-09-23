/**
 * Провайдер-агностичная абстракция: резюме, роадмап и интервью не знают,
 * какой конкретный LLM-провайдер стоит за LlmService — см. раздел «LLM-интеграция» в ТЗ.
 */
export interface LlmProvider {
  /** Свободный текстовый промпт → текстовый ответ. */
  complete(prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string>;

  /** Стриминг ответа (используется для чата поведенческого интервью через SSE). */
  stream(prompt: string): AsyncIterable<string>;
}

export const LLM_PROVIDER = Symbol("LLM_PROVIDER");
