import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { RoadmapOnboardingDto } from "./dto/roadmap-onboarding.dto";
import type { RoadmapPaceDto } from "./dto/roadmap-pace.dto";
import type { TaskProgressUpdateDto } from "./dto/task-progress-update.dto";

/**
 * Построение роадмапа по форме онбординга (направление, гео, темп),
 * дерево навыков (skeleton roadmap.sh + hh.ru demand), трекинг задач и прогресса.
 *
 * Статус узла (UserSkillProgress.status) пересчитывается не только вручную —
 * см. InterviewModule: после каждой завершённой сессии баллы по темам
 * (QuestionBank.topic ↔ Skill.title) обновляют статус с source = "interview-result".
 */
@Injectable()
export class RoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromOnboarding(_userId: string, _data: RoadmapOnboardingDto) {
    throw new Error("Not implemented");
  }

  async setPace(_roadmapId: string, _pace: RoadmapPaceDto) {
    throw new Error("Not implemented");
  }

  async updateTaskProgress(_roadmapId: string, _update: TaskProgressUpdateDto) {
    throw new Error("Not implemented");
  }

  /** Сводка для экрана «Мой прогресс»: часы план/факт, доля узлов, история сессий. */
  async getProgressSummary(_userId: string) {
    throw new Error("Not implemented");
  }
}
