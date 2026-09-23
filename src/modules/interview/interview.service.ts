import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { LlmService } from "../llm/llm.service";

/**
 * Хаб → сессия (чат для поведенческих/технических, редактор кода + sandbox для
 * live-кодинга) → оценка ответа через LlmService → итоги с баллами по темам.
 *
 * finishSession() — точка входа обратной связи в роадмап: пересчитывает
 * UserSkillProgress для тем сессии (source = "interview-result").
 */
@Injectable()
export class InterviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llm: LlmService
  ) {}

  async startSession(_userId: string, _directionId: string, _type: string) {
    throw new Error("Not implemented");
  }

  async submitAnswer(_sessionId: string, _questionId: string, _payload: unknown) {
    throw new Error("Not implemented");
  }

  async finishSession(_sessionId: string) {
    // 1) агрегирует SessionAnswer.score по темам
    // 2) обновляет UserSkillProgress соответствующих Skill (через QuestionBank.topic ↔ Skill.title)
    // 3) возвращает итоги + рекомендацию, какой узел роадмапа подтянуть
    throw new Error("Not implemented");
  }
}
