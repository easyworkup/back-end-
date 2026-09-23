import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { InterviewService } from "./interview.service";

@ApiTags("interview-sessions")
@Controller("interview-sessions")
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  start(@Body() body: { userId: string; directionId: string; type: string }) {
    return this.interviewService.startSession(body.userId, body.directionId, body.type);
  }

  @Post(":id/answers")
  submitAnswer(@Param("id") id: string, @Body() body: { questionId: string; payload: unknown }) {
    return this.interviewService.submitAnswer(id, body.questionId, body.payload);
  }

  @Post(":id/finish")
  finish(@Param("id") id: string) {
    return this.interviewService.finishSession(id);
  }
}
