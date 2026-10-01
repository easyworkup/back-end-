import { createZodDto } from "nestjs-zod";
import { schemas } from "./schemas";

// Concrete DTOs for controller implementations. Contract schema is the source of truth.
export class ApiErrorDto extends createZodDto(schemas.ApiError) {}
export class RegisterRequestDto extends createZodDto(schemas.RegisterRequest) {}
export class LoginRequestDto extends createZodDto(schemas.LoginRequest) {}
export class AuthResponseDto extends createZodDto(schemas.AuthResponse) {}
export class UserDto extends createZodDto(schemas.User) {}
export class ForgotPasswordRequestDto extends createZodDto(schemas.ForgotPasswordRequest) {}
export class ResetPasswordRequestDto extends createZodDto(schemas.ResetPasswordRequest) {}
export class MessageDto extends createZodDto(schemas.Message) {}
export class ProfileDto extends createZodDto(schemas.Profile) {}
export class UpdateProfileRequestDto extends createZodDto(schemas.UpdateProfileRequest) {}
export class DeleteAccountRequestDto extends createZodDto(schemas.DeleteAccountRequest) {}
export class PaceRequestDto extends createZodDto(schemas.PaceRequest) {}
export class PaceResponseDto extends createZodDto(schemas.PaceResponse) {}
export class DirectionListDto extends createZodDto(schemas.DirectionList) {}
export class SkillListDto extends createZodDto(schemas.SkillList) {}
export class ResumeContentDto extends createZodDto(schemas.ResumeContent) {}
export class CreateResumeRequestDto extends createZodDto(schemas.CreateResumeRequest) {}
export class UpdateResumeRequestDto extends createZodDto(schemas.UpdateResumeRequest) {}
export class ResumeDto extends createZodDto(schemas.Resume) {}
export class ResumeListDto extends createZodDto(schemas.ResumeList) {}
export class RevisionRequestDto extends createZodDto(schemas.RevisionRequest) {}
export class ReviewRequestDto extends createZodDto(schemas.ReviewRequest) {}
export class SuggestionDto extends createZodDto(schemas.Suggestion) {}
export class SuggestionRequestDto extends createZodDto(schemas.SuggestionRequest) {}
export class JobAcceptedDto extends createZodDto(schemas.JobAccepted) {}
export class JobDto extends createZodDto(schemas.Job) {}
export class RoadmapTreeDto extends createZodDto(schemas.RoadmapTree) {}
export class CreateRoadmapRequestDto extends createZodDto(schemas.CreateRoadmapRequest) {}
export class RoadmapProgressDto extends createZodDto(schemas.RoadmapProgress) {}
export class SkillProgressRequestDto extends createZodDto(schemas.SkillProgressRequest) {}
export class TaskProgressRequestDto extends createZodDto(schemas.TaskProgressRequest) {}
export class SyncRequestDto extends createZodDto(schemas.SyncRequest) {}
export class StartInterviewRequestDto extends createZodDto(schemas.StartInterviewRequest) {}
export class InterviewSessionDto extends createZodDto(schemas.InterviewSession) {}
export class InterviewListDto extends createZodDto(schemas.InterviewList) {}
export class AnswerRequestDto extends createZodDto(schemas.AnswerRequest) {}
export class CodeRequestDto extends createZodDto(schemas.CodeRequest) {}
export class InterviewResultDto extends createZodDto(schemas.InterviewResult) {}
// Discriminated unions are parsed directly; TypeScript cannot extend them as a class.
export const StreamEventDto = createZodDto(schemas.StreamEvent);
export class ProgressSummaryDto extends createZodDto(schemas.ProgressSummary) {}
