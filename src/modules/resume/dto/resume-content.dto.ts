import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * Шаг 1 конструктора резюме. Раньше это была общая Zod-схема из пакета shared —
 * теперь источник истины один: этот DTO на бэке. Фронт получает эквивалентную
 * Zod-схему для валидации формы через генерацию (orval, client: "zod") из
 * OpenAPI-спеки, которую nestjs-zod строит из этого класса.
 */
export const resumeContentSchema = z.object({
  fullName: z.string().min(2, "Укажите имя и фамилию"),
  directionSlug: z.string().min(1, "Выберите направление"),
  location: z.string().optional(),
  remoteOnly: z.boolean().default(false),
  summary: z.string().max(600).optional(),
  experience: z
    .array(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        from: z.string(), // YYYY-MM
        to: z.string().optional(), // пусто = по настоящее время
        description: z.string().max(1000).optional(),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string().min(1),
        degree: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  links: z.array(z.string().url()).default([]),
});

export class ResumeContentDto extends createZodDto(resumeContentSchema) {}

export const resumeAiReviewRequestSchema = z.object({
  vacancyText: z.string().max(5000).optional(),
});

export class ResumeAiReviewRequestDto extends createZodDto(resumeAiReviewRequestSchema) {}
