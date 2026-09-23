import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResumeService } from "./resume.service";
import { ResumeAiReviewRequestDto } from "./dto/resume-content.dto";

@ApiTags("resumes")
@Controller("resumes")
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    return { id, note: "TODO: вернуть Resume по id" };
  }

  @Post(":id/ai-review")
  requestAiReview(@Param("id") id: string, @Body() body: ResumeAiReviewRequestDto) {
    return this.resumeService.requestAiReview(id, body.vacancyText);
  }
}
