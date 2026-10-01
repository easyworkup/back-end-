BEGIN;
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobKind" AS ENUM ('RESUME_REVIEW', 'RESUME_PDF', 'ROADMAP_SYNC', 'ANSWER_REVIEW', 'CODE_RUN');

-- DropForeignKey
ALTER TABLE "UserRoadmap" DROP CONSTRAINT "UserRoadmap_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkillProgress" DROP CONSTRAINT "UserSkillProgress_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "UserTaskProgress" DROP CONSTRAINT "UserTaskProgress_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeAiSuggestion" DROP CONSTRAINT "ResumeAiSuggestion_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewSession" DROP CONSTRAINT "InterviewSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionAnswer" DROP CONSTRAINT "SessionAnswer_sessionId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "directionId" TEXT,
ADD COLUMN     "field" TEXT NOT NULL DEFAULT 'it',
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "onboardingSkipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "license" TEXT,
ADD COLUMN     "sourceUrl" TEXT;

-- AlterTable
ALTER TABLE "UserSkillProgress" ADD COLUMN     "sourceSessionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RoadmapTask" ADD COLUMN     "license" TEXT;

-- AlterTable
ALTER TABLE "UserTaskProgress" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Резюме';

-- AlterTable
ALTER TABLE "ResumeAiSuggestion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "proposedValue" JSONB,
ADD COLUMN     "sourceRevision" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "VacancySnapshot" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "QuestionBank" ADD COLUMN     "license" TEXT,
ADD COLUMN     "rubric" JSONB,
ADD COLUMN     "skillId" TEXT,
ADD COLUMN     "sourceUrl" TEXT;

-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "result" JSONB,
ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "SessionAnswer" ADD COLUMN     "clientMessageId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "LearningDay" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LearningDay_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "JobKind" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "idempotencyKey" TEXT NOT NULL,
    "resourceId" TEXT,
    "resourceRevision" INTEGER,
    "result" JSONB,
    "errorCode" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeRevision" (
    "resumeId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "vacancyText" TEXT,
    "atsScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeRevision_pkey" PRIMARY KEY ("resumeId","revision")
);

-- CreateTable
CREATE TABLE "SessionQuestion" (
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SessionQuestion_pkey" PRIMARY KEY ("sessionId","questionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "BackgroundJob_status_createdAt_idx" ON "BackgroundJob"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BackgroundJob_expiresAt_idx" ON "BackgroundJob"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "BackgroundJob_userId_kind_idempotencyKey_key" ON "BackgroundJob"("userId", "kind", "idempotencyKey");

-- CreateIndex
CREATE INDEX "SessionQuestion_questionId_idx" ON "SessionQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionQuestion_sessionId_position_key" ON "SessionQuestion"("sessionId", "position");

-- CreateIndex
CREATE INDEX "Skill_directionId_idx" ON "Skill"("directionId");

-- CreateIndex
CREATE INDEX "Skill_parentId_idx" ON "Skill"("parentId");

-- CreateIndex
CREATE INDEX "UserRoadmap_directionId_idx" ON "UserRoadmap"("directionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoadmap_userId_directionId_key" ON "UserRoadmap"("userId", "directionId");

-- CreateIndex
CREATE INDEX "UserSkillProgress_skillId_idx" ON "UserSkillProgress"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkillProgress_roadmapId_skillId_key" ON "UserSkillProgress"("roadmapId", "skillId");

-- CreateIndex
CREATE INDEX "RoadmapTask_skillId_idx" ON "RoadmapTask"("skillId");

-- CreateIndex
CREATE INDEX "UserTaskProgress_taskId_idx" ON "UserTaskProgress"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTaskProgress_roadmapId_taskId_key" ON "UserTaskProgress"("roadmapId", "taskId");

-- CreateIndex
CREATE INDEX "Resume_userId_updatedAt_idx" ON "Resume"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Resume_directionId_idx" ON "Resume"("directionId");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_id_key" ON "Resume"("userId", "id");

-- CreateIndex
CREATE INDEX "ResumeAiSuggestion_resumeId_status_idx" ON "ResumeAiSuggestion"("resumeId", "status");

-- CreateIndex
CREATE INDEX "VacancySnapshot_directionId_regionId_fetchedAt_idx" ON "VacancySnapshot"("directionId", "regionId", "fetchedAt");

-- CreateIndex
CREATE INDEX "QuestionBank_directionId_type_idx" ON "QuestionBank"("directionId", "type");

-- CreateIndex
CREATE INDEX "QuestionBank_skillId_idx" ON "QuestionBank"("skillId");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_startedAt_idx" ON "InterviewSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "InterviewSession_directionId_idx" ON "InterviewSession"("directionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSession_userId_idempotencyKey_key" ON "InterviewSession"("userId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "SessionAnswer_questionId_idx" ON "SessionAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionAnswer_sessionId_questionId_key" ON "SessionAnswer"("sessionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionAnswer_sessionId_clientMessageId_key" ON "SessionAnswer"("sessionId", "clientMessageId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmap" ADD CONSTRAINT "UserRoadmap_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmap" ADD CONSTRAINT "UserRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkillProgress" ADD CONSTRAINT "UserSkillProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkillProgress" ADD CONSTRAINT "UserSkillProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "UserRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskProgress" ADD CONSTRAINT "UserTaskProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "UserRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAiSuggestion" ADD CONSTRAINT "ResumeAiSuggestion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBank" ADD CONSTRAINT "QuestionBank_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBank" ADD CONSTRAINT "QuestionBank_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAnswer" ADD CONSTRAINT "SessionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAnswer" ADD CONSTRAINT "SessionAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningDay" ADD CONSTRAINT "LearningDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeRevision" ADD CONSTRAINT "ResumeRevision_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



CREATE UNIQUE INDEX "Resume_one_active_per_user" ON "Resume" ("userId") WHERE "isActive";
ALTER TABLE "LearningDay" ADD CONSTRAINT "LearningDay_day_hours_check" CHECK ("day" BETWEEN 1 AND 7 AND "hours" BETWEEN 0 AND 12);
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_revision_check" CHECK ("revision" > 0);
ALTER TABLE "ResumeRevision" ADD CONSTRAINT "ResumeRevision_revision_check" CHECK ("revision" > 0);
ALTER TABLE "UserTaskProgress" ADD CONSTRAINT "UserTaskProgress_hours_check" CHECK ("actualHours" IS NULL OR "actualHours" BETWEEN 0 AND 200);
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_hours_check" CHECK ("estimatedHours" >= 0 AND "completionsCount" >= 0);
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_position_check" CHECK ("position" >= 0);
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_attempts_check" CHECK ("attempts" >= 0);
INSERT INTO "ResumeRevision" ("resumeId",revision,content,"vacancyText","atsScore") SELECT id,revision,content,"vacancyText","atsScore" FROM "Resume";
UPDATE "QuestionBank" q SET "skillId"=s.id FROM "Skill" s WHERE s."directionId"=q."directionId" AND s.title=q.topic
 AND (SELECT count(*) FROM "Skill" x WHERE x."directionId"=q."directionId" AND x.title=q.topic)=1;
UPDATE "InterviewSession" SET status='COMPLETED' WHERE "finishedAt" IS NOT NULL;
INSERT INTO "SessionQuestion" ("sessionId","questionId",position)
 SELECT "sessionId","questionId",(row_number() OVER(PARTITION BY "sessionId" ORDER BY id)-1)::int FROM "SessionAnswer";

COMMIT;
