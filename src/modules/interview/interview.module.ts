import { Module } from "@nestjs/common";
import { InterviewController } from "./interview.controller";
import { InterviewService } from "./interview.service";
import { LlmModule } from "../llm/llm.module";
import { RoadmapModule } from "../roadmap/roadmap.module";

@Module({
  imports: [LlmModule, RoadmapModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
