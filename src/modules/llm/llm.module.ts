import { Module } from "@nestjs/common";
import { LlmService } from "./llm.service";
import { LLM_PROVIDER } from "./llm-provider.interface";

/**
 * TODO: подключить реальный провайдер (OpenAI/Anthropic/локальная модель)
 * по значению process.env.LLM_PROVIDER — здесь только заглушка контракта.
 */
@Module({
  providers: [
    LlmService,
    {
      provide: LLM_PROVIDER,
      useValue: {
        async complete() {
          throw new Error("LLM provider not configured");
        },
        async *stream() {
          throw new Error("LLM provider not configured");
        },
      },
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
