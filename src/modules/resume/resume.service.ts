import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { LlmService } from "../llm/llm.service";
import type { ResumeContentDto } from "./dto/resume-content.dto";

/**
 * Резюме: сохранение шага 1 (content валидируется ResumeContentDto — тем же
 * контрактом, из которого фронт генерирует Zod-схему для формы через orval),
 * ИИ-ревью (AI-подсказки + ATS-скор) через LlmService.
 */
@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llm: LlmService
  ) {}

  async saveDraft(_userId: string, _content: ResumeContentDto) {
    throw new Error("Not implemented");
  }

  async requestAiReview(_resumeId: string, _vacancyText?: string) {
    // делегирует в LlmService.reviewResume — см. модуль llm
    throw new Error("Not implemented");
  }
}
