import { Inject, Injectable } from "@nestjs/common";
import { LLM_PROVIDER, LlmProvider } from "./llm-provider.interface";

/**
 * Единая точка входа для всех LLM-вызовов в приложении:
 * ревью резюме, генерация роадмапа/задач, чат интервьюера, оценка кода.
 */
@Injectable()
export class LlmService {
  constructor(@Inject(LLM_PROVIDER) private readonly provider: LlmProvider) {}

  async reviewResume(_resumeContent: unknown, _vacancyText?: string) {
    throw new Error("Not implemented");
  }

  async generateRoadmapTasks(_skillId: string) {
    throw new Error("Not implemented");
  }

  async evaluateAnswer(_questionPrompt: string, _answerText: string) {
    throw new Error("Not implemented");
  }

  async evaluateCode(_taskId: string, _submission: unknown, _testResults: unknown) {
    throw new Error("Not implemented");
  }
}
