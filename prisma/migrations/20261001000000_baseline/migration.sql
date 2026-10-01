-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('NONE', 'PARTIAL', 'DONE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('READING', 'VIDEO', 'EXERCISE', 'PROJECT');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPLIED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('BEHAVIORAL', 'TECHNICAL', 'CODING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direction" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Direction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "parentId" TEXT,
    "hhKeywords" TEXT[],
    "demandScore" DOUBLE PRECISION,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkillProgress" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL,
    "source" TEXT,

    CONSTRAINT "UserSkillProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapTask" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "completionsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoadmapTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskProgress" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "actualHours" DOUBLE PRECISION,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserTaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "vacancyText" TEXT,
    "atsScore" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeAiSuggestion" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "fieldPath" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL,

    CONSTRAINT "ResumeAiSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancySnapshot" (
    "id" TEXT NOT NULL,
    "hhId" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skills" TEXT[],
    "salaryFrom" INTEGER,
    "salaryTo" INTEGER,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VacancySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "topic" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "isGenerated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodingTask" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "testCases" JSONB NOT NULL,
    "referenceSolution" TEXT NOT NULL,

    CONSTRAINT "CodingTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerText" TEXT,
    "codeSubmission" JSONB,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,

    CONSTRAINT "SessionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Direction_slug_key" ON "Direction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VacancySnapshot_hhId_key" ON "VacancySnapshot"("hhId");

-- CreateIndex
CREATE UNIQUE INDEX "CodingTask_questionId_key" ON "CodingTask"("questionId");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmap" ADD CONSTRAINT "UserRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkillProgress" ADD CONSTRAINT "UserSkillProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "UserRoadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskProgress" ADD CONSTRAINT "UserTaskProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "UserRoadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskProgress" ADD CONSTRAINT "UserTaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RoadmapTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAiSuggestion" ADD CONSTRAINT "ResumeAiSuggestion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancySnapshot" ADD CONSTRAINT "VacancySnapshot_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodingTask" ADD CONSTRAINT "CodingTask_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAnswer" ADD CONSTRAINT "SessionAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
