import { z } from "zod";
import { resumeContentSchema } from "../modules/resume/dto/resume-content.dto";
import { roadmapPaceSchema } from "../modules/roadmap/dto/roadmap-pace.dto";

const id = z.string().uuid();
const date = z.string().datetime();
const revision = z.number().int().positive();
const kind = z.enum(["BEHAVIORAL", "TECHNICAL", "CODING"]);
const status = z.enum(["NONE", "PARTIAL", "DONE"]);
const source = z.enum(["resume-match", "manual", "interview-result"]);
const user = z.object({ id, email: z.string().email(), fullName: z.string().nullable() });
const content = resumeContentSchema.extend({
  email: z.string().email().optional(),
  desiredPosition: z.string().max(200).optional(),
});
const resume = z.object({
  id,
  directionId: id,
  title: z.string(),
  revision,
  isActive: z.boolean(),
  content,
  vacancyText: z.string().nullable(),
  atsScore: z.number().min(0).max(100).nullable(),
  updatedAt: date,
});
const suggestion = z.object({
  id,
  fieldPath: z.string(),
  message: z.string(),
  sourceRevision: revision,
  proposedValue: z.union([z.string(), z.array(z.string())]),
  status: z.enum(["PENDING", "APPLIED", "DISMISSED"]),
});
const skillProgress = z.object({
  skillId: id,
  status,
  source: source.nullable(),
  updatedAt: date,
  reason: z.string().nullable(),
  sourceSessionId: id.nullable(),
});
const taskProgress = z.object({
  taskId: id,
  done: z.boolean(),
  actualHours: z.number().min(0).max(200).nullable(),
});
const question = z.object({
  id,
  skillId: id.nullable(),
  type: kind,
  prompt: z.string(),
  position: z.number().int().min(0),
  starterCode: z.string().nullable(),
  language: z.string().nullable(),
});
const session = z.object({
  id,
  directionId: id,
  type: kind,
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ABANDONED"]),
  startedAt: date,
  finishedAt: date.nullable(),
  questions: z.array(question),
  answeredQuestionIds: z.array(id),
});
const feedback = z.object({
  questionId: id,
  score: z.number().min(0).max(100).nullable(),
  feedback: z.string(),
  star: z
    .object({ situation: z.string(), task: z.string(), action: z.string(), result: z.string() })
    .nullable(),
});
const topicScore = z.object({
  skillId: id,
  title: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
});
const result = z.object({
  sessionId: id,
  status: z.enum(["PARTIAL", "COMPLETE"]),
  score: z.number().min(0).max(100).nullable(),
  topics: z.array(topicScore),
  answers: z.array(feedback),
  recommendedSkillIds: z.array(id),
});
const codeResult = z.object({
  verdict: z.enum([
    "PASSED",
    "FAILED",
    "TIMEOUT",
    "MEMORY_LIMIT",
    "COMPILE_ERROR",
    "RUNTIME_ERROR",
  ]),
  stdout: z.string(),
  stderr: z.string(),
  tests: z.array(z.object({ name: z.string(), passed: z.boolean() })),
  review: z.string().nullable(),
});
const jobResult = z.union([
  z.object({
    kind: z.literal("RESUME_REVIEW"),
    resumeId: id,
    revision,
    atsScore: z.number().min(0).max(100).nullable(),
    suggestions: z.array(suggestion),
  }),
  z.object({ kind: z.literal("RESUME_PDF"), downloadUrl: z.string().url(), expiresAt: date }),
  z.object({ kind: z.literal("ROADMAP_SYNC"), roadmapId: id, progress: z.array(skillProgress) }),
  z.object({ kind: z.literal("ANSWER_REVIEW"), answer: feedback }),
  z.object({ kind: z.literal("CODE_RUN"), submission: codeResult }),
]);
const errorCode = z.enum([
  "VALIDATION_ERROR",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "TOKEN_INVALID",
  "PROVIDER_UNAVAILABLE",
  "INTERNAL_ERROR",
  "NOT_IMPLEMENTED",
]);
const error = z.object({
  error: z.object({
    code: errorCode,
    message: z.string(),
    requestId: z.string(),
    fieldErrors: z.record(z.array(z.string())).optional(),
  }),
});
const page = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() });

// Shared wire schemas. Reuse these schemas/createZodDto at implementation time;
// do not infer server response types from placeholder service return values.
export const schemas = {
  ApiError: error,
  RegisterRequest: z.object({
    fullName: z.string().min(2).max(200),
    email: z.string().email(),
    password: z.string().min(12).max(128),
    acceptedTerms: z.literal(true),
  }),
  LoginRequest: z.object({
    email: z.string().email(),
    password: z.string().min(1).max(128),
    rememberMe: z.boolean().default(false),
  }),
  AuthResponse: z.object({ user, accessToken: z.string(), expiresIn: z.number().int().positive() }),
  User: user,
  ForgotPasswordRequest: z.object({ email: z.string().email() }),
  ResetPasswordRequest: z.object({
    token: z.string().min(32).max(512),
    password: z.string().min(12).max(128),
  }),
  Message: z.object({ message: z.string() }),
  Profile: z.object({
    fullName: z.string().nullable(),
    field: z.literal("it"),
    directionId: id.nullable(),
    remote: z.boolean(),
    city: z.string().nullable(),
    onboardingSkipped: z.boolean(),
  }),
  UpdateProfileRequest: z.object({
    fullName: z.string().min(2).max(200).optional(),
    directionId: id.optional(),
    remote: z.boolean().optional(),
    city: z.string().max(200).nullable().optional(),
    onboardingSkipped: z.boolean().optional(),
  }),
  DeleteAccountRequest: z.object({
    password: z.string().min(1).max(128),
    confirmation: z.literal("DELETE"),
  }),
  PaceRequest: roadmapPaceSchema,
  PaceResponse: roadmapPaceSchema.extend({
    weeklyHours: z.number().min(0),
    estimatedWeeks: z.number().min(0).nullable(),
  }),
  DirectionList: z.object({
    items: z.array(z.object({ id, slug: z.string(), title: z.string() })),
  }),
  SkillList: z.object({ items: z.array(z.object({ id, title: z.string() })) }),
  ResumeContent: content,
  CreateResumeRequest: z.object({ directionId: id, title: z.string().min(1).max(200) }),
  UpdateResumeRequest: z.object({
    revision,
    content,
    title: z.string().min(1).max(200).optional(),
    vacancyText: z.string().max(10000).nullable().optional(),
  }),
  Resume: resume,
  ResumeList: page(resume),
  RevisionRequest: z.object({ revision }),
  ReviewRequest: z.object({ revision, vacancyText: z.string().max(10000).optional() }),
  Suggestion: suggestion,
  SuggestionRequest: z.object({ revision, action: z.enum(["APPLY", "DISMISS"]) }),
  JobAccepted: z.object({ jobId: id, status: z.literal("QUEUED") }),
  Job: z.object({
    id,
    kind: z.enum(["RESUME_REVIEW", "RESUME_PDF", "ROADMAP_SYNC", "ANSWER_REVIEW", "CODE_RUN"]),
    status: z.enum(["QUEUED", "RUNNING", "SUCCEEDED", "FAILED"]),
    result: jobResult.nullable(),
    error: error.shape.error.nullable(),
    updatedAt: date,
  }),
  RoadmapTree: z.object({
    directionId: id,
    nodes: z.array(
      z.object({
        id,
        title: z.string(),
        parentId: id.nullable(),
        demandScore: z.number().min(0).max(1).nullable(),
        tasks: z.array(
          z.object({
            id,
            title: z.string(),
            sourceUrl: z.string().url().nullable(),
            sourceLabel: z.string(),
            estimatedHours: z.number().min(0),
          })
        ),
      })
    ),
    edges: z.array(z.object({ source: id, target: id })),
    market: z.object({
      sampleSize: z.number().int().min(0),
      updatedAt: date.nullable(),
      regionId: z.string().nullable(),
    }),
  }),
  CreateRoadmapRequest: z.object({ directionId: id }),
  RoadmapProgress: z.object({
    id,
    directionId: id,
    skills: z.array(skillProgress),
    tasks: z.array(taskProgress),
  }),
  SkillProgressRequest: z.object({ status }),
  TaskProgressRequest: z.object({
    done: z.boolean(),
    actualHours: z.number().min(0).max(200).nullable(),
  }),
  SyncRequest: z.object({ resumeId: id, revision }),
  StartInterviewRequest: z.object({ directionId: id, type: kind }),
  InterviewSession: session,
  InterviewList: page(session),
  AnswerRequest: z.object({
    questionId: id,
    clientMessageId: id,
    text: z.string().min(1).max(20000),
  }),
  CodeRequest: z.object({
    questionId: id,
    clientMessageId: id,
    language: z.literal("typescript"),
    code: z.string().min(1).max(100000),
  }),
  InterviewResult: result,
  StreamEvent: z.discriminatedUnion("type", [
    z.object({ id: z.string(), type: z.literal("delta"), sessionId: id, text: z.string() }),
    z.object({ id: z.string(), type: z.literal("feedback"), sessionId: id, answer: feedback }),
    z.object({ id: z.string(), type: z.literal("error"), sessionId: id, error: error.shape.error }),
    z.object({ id: z.string(), type: z.literal("done"), sessionId: id }),
  ]),
  ProgressSummary: z.object({
    plannedHours: z.number().min(0),
    actualHours: z.number().min(0),
    completedSkills: z.number().int().min(0),
    totalSkills: z.number().int().min(0),
    estimatedWeeks: z.number().min(0).nullable(),
    interviews: z.array(
      z.object({ sessionId: id, type: kind, finishedAt: date, score: z.number().nullable() })
    ),
    atsHistory: z.array(
      z.object({ resumeId: id, revision, score: z.number().min(0).max(100), createdAt: date })
    ),
    nextAction: z
      .object({
        type: z.enum(["CREATE_RESUME", "STUDY_SKILL", "CONTINUE_INTERVIEW"]),
        resourceId: id.nullable(),
      })
      .nullable(),
  }),
};
export type SchemaName = keyof typeof schemas;
