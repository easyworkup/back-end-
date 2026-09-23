import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * Форма онбординга роадмапа — заполняется один раз сразу после регистрации.
 */
export const roadmapOnboardingSchema = z.object({
  fullName: z.string().min(2),
  field: z.literal("it"), // на MVP всегда "IT", задел под другие сферы на будущее
  directionSlug: z.string().min(1),
  remote: z.boolean(),
  city: z.string().optional(), // обязательно, если remote === false
});

export class RoadmapOnboardingDto extends createZodDto(roadmapOnboardingSchema) {}

/**
 * То же самое + userId — временно, пока нет auth guard'а, вытаскивающего
 * пользователя из JWT. Когда AuthModule будет готов, userId уйдёт из тела
 * запроса в @CurrentUser()/request.user, а этот DTO схлопнется обратно
 * в RoadmapOnboardingDto.
 */
export const createRoadmapSchema = roadmapOnboardingSchema.extend({
  userId: z.string().uuid(),
});

export class CreateRoadmapDto extends createZodDto(createRoadmapSchema) {}
