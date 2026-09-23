import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoadmapService } from "./roadmap.service";
import { CreateRoadmapDto } from "./dto/roadmap-onboarding.dto";
import { RoadmapPaceDto } from "./dto/roadmap-pace.dto";
import { TaskProgressUpdateDto } from "./dto/task-progress-update.dto";

@ApiTags("roadmaps")
@Controller("roadmaps")
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  create(@Body() body: CreateRoadmapDto) {
    return this.roadmapService.createFromOnboarding(body.userId, body);
  }

  @Post(":id/pace")
  setPace(@Param("id") id: string, @Body() body: RoadmapPaceDto) {
    return this.roadmapService.setPace(id, body);
  }

  @Post(":id/tasks")
  updateTaskProgress(@Param("id") id: string, @Body() body: TaskProgressUpdateDto) {
    return this.roadmapService.updateTaskProgress(id, body);
  }

  @Get(":userId/progress")
  getProgress(@Param("userId") userId: string) {
    return this.roadmapService.getProgressSummary(userId);
  }
}
