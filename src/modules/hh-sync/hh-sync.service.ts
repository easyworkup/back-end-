import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * ETL с hh.ru: периодически (через BullMQ-шедулер, не на каждый запрос
 * пользователя) тянет вакансии в VacancySnapshot и пересчитывает Skill.demandScore.
 * RoadmapMod и ResumeMod читают уже из Postgres, не дёргая hh.ru напрямую.
 */
@Injectable()
export class HhSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async syncDirection(_directionSlug: string) {
    throw new Error("Not implemented");
  }
}
