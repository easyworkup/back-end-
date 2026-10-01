import type {
  OpenAPIObject,
  SchemaObject,
  OperationObject,
  ParameterObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { zodToOpenAPI } from "nestjs-zod";
import { schemas, SchemaName } from "./schemas";

export const CONTRACT_VERSION = "1.0.0";
type Route = [
  method: "get" | "post" | "patch" | "delete",
  path: string,
  operationId: string,
  tag: string,
  request: SchemaName | null,
  response: SchemaName | null,
  code: number,
  access?: "public" | "refresh",
  idempotent?: boolean,
];
export const routes: Route[] = [
  ["post", "/auth/register", "register", "auth", "RegisterRequest", "AuthResponse", 201, "public"],
  ["post", "/auth/login", "login", "auth", "LoginRequest", "AuthResponse", 200, "public"],
  ["post", "/auth/refresh", "refreshSession", "auth", null, "AuthResponse", 200, "refresh"],
  ["post", "/auth/logout", "logout", "auth", null, null, 204, "refresh"],
  [
    "post",
    "/auth/forgot-password",
    "requestPasswordReset",
    "auth",
    "ForgotPasswordRequest",
    "Message",
    200,
    "public",
  ],
  [
    "post",
    "/auth/reset-password",
    "resetPassword",
    "auth",
    "ResetPasswordRequest",
    "Message",
    200,
    "public",
  ],
  ["get", "/me", "getCurrentUser", "profile", null, "User", 200],
  ["get", "/me/profile", "getProfile", "profile", null, "Profile", 200],
  ["patch", "/me/profile", "updateProfile", "profile", "UpdateProfileRequest", "Profile", 200],
  ["get", "/me/pace", "getPace", "profile", null, "PaceResponse", 200],
  ["patch", "/me/pace", "updatePace", "profile", "PaceRequest", "PaceResponse", 200],
  ["delete", "/me", "deleteAccount", "profile", "DeleteAccountRequest", null, 204],
  ["get", "/directions", "listDirections", "catalog", null, "DirectionList", 200, "public"],
  [
    "get",
    "/directions/{directionId}/skills",
    "listSkills",
    "catalog",
    null,
    "SkillList",
    200,
    "public",
  ],
  [
    "get",
    "/directions/{directionId}/roadmap",
    "getPublicRoadmap",
    "catalog",
    null,
    "RoadmapTree",
    200,
    "public",
  ],
  ["get", "/resumes", "listResumes", "resumes", null, "ResumeList", 200],
  [
    "post",
    "/resumes",
    "createResume",
    "resumes",
    "CreateResumeRequest",
    "Resume",
    201,
    undefined,
    true,
  ],
  ["get", "/resumes/{id}", "getResume", "resumes", null, "Resume", 200],
  ["patch", "/resumes/{id}", "updateResume", "resumes", "UpdateResumeRequest", "Resume", 200],
  ["delete", "/resumes/{id}", "deleteResume", "resumes", null, null, 204],
  [
    "post",
    "/resumes/{id}/active",
    "selectActiveResume",
    "resumes",
    "RevisionRequest",
    "Resume",
    200,
  ],
  [
    "post",
    "/resumes/{id}/ai-review",
    "reviewResume",
    "resumes",
    "ReviewRequest",
    "JobAccepted",
    202,
    undefined,
    true,
  ],
  [
    "post",
    "/resumes/{id}/pdf",
    "exportResumePdf",
    "resumes",
    "RevisionRequest",
    "JobAccepted",
    202,
    undefined,
    true,
  ],
  [
    "patch",
    "/resumes/{id}/suggestions/{suggestionId}",
    "resolveSuggestion",
    "resumes",
    "SuggestionRequest",
    "Resume",
    200,
  ],
  ["get", "/jobs/{id}", "getJob", "jobs", null, "Job", 200],
  [
    "post",
    "/roadmaps",
    "createRoadmap",
    "roadmaps",
    "CreateRoadmapRequest",
    "RoadmapProgress",
    200,
  ],
  [
    "get",
    "/roadmaps/{id}/progress",
    "getRoadmapProgress",
    "roadmaps",
    null,
    "RoadmapProgress",
    200,
  ],
  [
    "patch",
    "/roadmaps/{id}/skills/{skillId}",
    "updateSkillProgress",
    "roadmaps",
    "SkillProgressRequest",
    "RoadmapProgress",
    200,
  ],
  [
    "patch",
    "/roadmaps/{id}/tasks/{taskId}",
    "updateTaskProgress",
    "roadmaps",
    "TaskProgressRequest",
    "RoadmapProgress",
    200,
  ],
  [
    "post",
    "/roadmaps/{id}/sync-resume",
    "syncResumeSkills",
    "roadmaps",
    "SyncRequest",
    "JobAccepted",
    202,
    undefined,
    true,
  ],
  ["get", "/interview-sessions", "listInterviews", "interviews", null, "InterviewList", 200],
  [
    "post",
    "/interview-sessions",
    "startInterview",
    "interviews",
    "StartInterviewRequest",
    "InterviewSession",
    201,
    undefined,
    true,
  ],
  ["get", "/interview-sessions/{id}", "getInterview", "interviews", null, "InterviewSession", 200],
  [
    "post",
    "/interview-sessions/{id}/answers",
    "submitAnswer",
    "interviews",
    "AnswerRequest",
    "JobAccepted",
    202,
    undefined,
    true,
  ],
  [
    "post",
    "/interview-sessions/{id}/code",
    "submitCode",
    "interviews",
    "CodeRequest",
    "JobAccepted",
    202,
    undefined,
    true,
  ],
  [
    "post",
    "/interview-sessions/{id}/finish",
    "finishInterview",
    "interviews",
    null,
    "InterviewResult",
    200,
  ],
  [
    "get",
    "/interview-sessions/{id}/result",
    "getInterviewResult",
    "interviews",
    null,
    "InterviewResult",
    200,
  ],
  [
    "get",
    "/interview-sessions/{id}/events",
    "streamInterview",
    "interviews",
    null,
    "StreamEvent",
    200,
  ],
  ["get", "/me/progress", "getProgressSummary", "progress", null, "ProgressSummary", 200],
];
const ref = (name: SchemaName) => ({ $ref: `#/components/schemas/${name}` });

/** Deterministic fixtures for consumer mock transports; never production data. */
export function exampleFor(s: SchemaObject): unknown {
  if (s.default !== undefined) return s.default;
  if (s.enum) return s.enum[0];
  if (s.oneOf || s.anyOf) return exampleFor((s.oneOf || s.anyOf)![0] as SchemaObject);
  if (s.nullable) return null;
  if (s.type === "object")
    return Object.fromEntries(
      Object.entries(s.properties || {})
        .filter(([name]) => s.required?.includes(name))
        .map(([name, prop]) => [name, exampleFor(prop as SchemaObject)])
    );
  if (s.type === "array")
    return Array.from({ length: s.minItems || 0 }, () => exampleFor(s.items as SchemaObject));
  if (s.type === "boolean") return false;
  if (s.type === "number" || s.type === "integer") return Math.max(s.minimum || 0, 1);
  if (s.format === "uuid") return "00000000-0000-4000-8000-000000000001";
  if (s.format === "date-time") return "2026-10-01T00:00:00.000Z";
  if (s.format === "email") return "developer@example.test";
  if (s.format === "uri" || s.format === "url") return "https://example.test/resource";
  return "example".padEnd(s.minLength || 0, "x");
}

export function buildContractDocument(): OpenAPIObject {
  const components = Object.fromEntries(
    Object.entries(schemas).map(([name, schema]) => [name, zodToOpenAPI(schema)])
  );
  // nestjs-zod 4 drops the value of boolean literals during OpenAPI conversion.
  (components.RegisterRequest.properties!.acceptedTerms as SchemaObject).enum = [true];
  const document: OpenAPIObject = {
    openapi: "3.0.3",
    info: {
      title: "EasyWorkUp API contract",
      version: CONTRACT_VERSION,
      description:
        "Contract-first MVP. x-implementation=planned is NOT a working endpoint. See docs/api-contract.md.",
    },
    paths: {},
    components: {
      schemas: components,
      securitySchemes: {
        accessToken: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        refreshCookie: { type: "apiKey", in: "cookie", name: "refresh_token" },
        csrfToken: { type: "apiKey", in: "header", name: "X-CSRF-Token" },
      },
    },
  };
  for (const [
    method,
    path,
    operationId,
    tag,
    request,
    response,
    code,
    access,
    idempotent,
  ] of routes) {
    const parameters: ParameterObject[] = [...path.matchAll(/\{(\w+)\}/g)].map((match) => ({
      name: match[1],
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
    }));
    if (idempotent)
      parameters.push({
        name: "Idempotency-Key",
        in: "header",
        required: true,
        schema: { type: "string", format: "uuid" },
        description:
          "Same key + same body returns the same resource/job; different body returns 409. Retain for >=24h.",
      });
    if (["listResumes", "listInterviews"].includes(operationId))
      parameters.push(
        { name: "cursor", in: "query", required: false, schema: { type: "string" } },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        }
      );
    if (operationId === "listSkills")
      parameters.push({ name: "q", in: "query", schema: { type: "string", maxLength: 100 } });
    if (operationId === "streamInterview")
      parameters.push({ name: "Last-Event-ID", in: "header", schema: { type: "string" } });
    const op: OperationObject & { "x-implementation": string } = {
      operationId,
      tags: [tag],
      summary: operationId,
      "x-implementation": "planned",
      description:
        "Target contract for parallel implementation; business logic remains a separate Jira task.",
      security:
        access === "public"
          ? []
          : access === "refresh"
            ? [{ refreshCookie: [], csrfToken: [] }]
            : [{ accessToken: [] }],
      parameters,
      responses: {
        [code]: {
          description: code === 204 ? "No content" : "Success",
          ...(response
            ? {
                content: {
                  [operationId === "streamInterview" ? "text/event-stream" : "application/json"]:
                    operationId === "streamInterview"
                      ? {
                          schema: { type: "string" },
                          example:
                            'id: 1\nevent: done\ndata: {"id":"1","type":"done","sessionId":"00000000-0000-4000-8000-000000000001"}\n\n',
                        }
                      : { schema: ref(response), example: exampleFor(components[response]) },
                },
              }
            : {}),
        },
      },
    };
    if (request)
      op.requestBody = {
        required: true,
        content: {
          "application/json": { schema: ref(request), example: exampleFor(components[request]) },
        },
      };
    for (const [statusCode, errorCode] of [
      [400, "VALIDATION_ERROR"],
      [401, "UNAUTHENTICATED"],
      [403, "FORBIDDEN"],
      [404, "NOT_FOUND"],
      [409, "CONFLICT"],
      [429, "RATE_LIMITED"],
      [500, "INTERNAL_ERROR"],
      [501, "NOT_IMPLEMENTED"],
      [503, "PROVIDER_UNAVAILABLE"],
    ] as const) {
      op.responses[statusCode] = {
        description: errorCode,
        content: {
          "application/json": {
            schema: ref("ApiError"),
            example: {
              error: {
                code: errorCode,
                message: "Request could not be completed",
                requestId: "example-request",
              },
            },
          },
        },
      };
    }
    (document.paths["/api" + path] ??= {})[method] = op;
  }
  return document;
}
