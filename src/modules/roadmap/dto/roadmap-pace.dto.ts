import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * Настройка темпа подготовки — часы по дням недели, шаг после онбординга.
 */
export const roadmapPaceSchema = z.object({
  hoursPerDay: z.object({
    mon: z.number().min(0).max(12),
    tue: z.number().min(0).max(12),
    wed: z.number().min(0).max(12),
    thu: z.number().min(0).max(12),
    fri: z.number().min(0).max(12),
    sat: z.number().min(0).max(12),
    sun: z.number().min(0).max(12),
  }),
});

export class RoadmapPaceDto extends createZodDto(roadmapPaceSchema) {}
