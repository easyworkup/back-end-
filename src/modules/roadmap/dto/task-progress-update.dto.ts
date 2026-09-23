import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const taskProgressUpdateSchema = z.object({
  taskId: z.string().uuid(),
  done: z.boolean(),
  actualHours: z.number().min(0).max(200).optional(),
});

export class TaskProgressUpdateDto extends createZodDto(taskProgressUpdateSchema) {}
