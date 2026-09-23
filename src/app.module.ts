import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ResumeModule } from "./modules/resume/resume.module";
import { RoadmapModule } from "./modules/roadmap/roadmap.module";
import { InterviewModule } from "./modules/interview/interview.module";
import { LlmModule } from "./modules/llm/llm.module";
import { HhSyncModule } from "./modules/hh-sync/hh-sync.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ResumeModule,
    RoadmapModule,
    InterviewModule,
    LlmModule,
    HhSyncModule,
  ],
})
export class AppModule {}
