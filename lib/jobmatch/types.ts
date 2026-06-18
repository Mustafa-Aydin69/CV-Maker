// lib/jobmatch/types.ts

export interface NormalizedText {
  original: string;
  lower: string;
  searchable: string;
  tokens: string[];
}

export type JobSentenceCategory =
  | "mandatory_requirement"
  | "preferred_requirement"
  | "hard_skill"
  | "tool"
  | "education"
  | "experience"
  | "language"
  | "certificate"
  | "domain_context"
  | "soft_skill"
  | "responsibility"
  | "company_description"
  | "benefit"
  | "application_process"
  | "marketing"
  | "other";

export interface ClassifiedJobSentence {
  id: string;
  text: string;
  category: JobSentenceCategory;
  importance: number;
  isCandidateRequirement: boolean;
  sourceSection?: string;
  confidence: number;
}

export type RequirementLevel = "mandatory" | "preferred" | "contextual";

export type RequirementType =
  | "eligibility"
  | "hard_skill"
  | "tool"
  | "education"
  | "experience"
  | "language"
  | "certificate"
  | "domain"
  | "soft_skill";

export interface JobRequirement {
  id: string;
  conceptId: string;
  label: string;
  type: RequirementType;
  level: RequirementLevel;
  weight: number;
  aliases: string[];
  relatedConceptIds?: string[];
  sourceText: string;
  sourceSection?: string;
  confidence: number;
  requiresExplicitEvidence: boolean;
}

export interface SkillConcept {
  id: string;
  label: string;
  aliases: string[];
  related: string[];
  parent?: string;
  category: "hard_skill" | "tool" | "domain" | "soft_skill";
}

export interface CvEvidence {
  sectionId: string;
  sectionType: string;
  text: string;
  conceptId?: string;
  strength: number;
}

export type MatchMethod =
  | "exact"
  | "alias"
  | "related"
  | "semantic"
  | "explicit_user_answer"
  | "none";

export type MatchStatus =
  | "matched"
  | "partial_match"
  | "not_mentioned"
  | "confirmed_missing"
  | "not_applicable";

export interface RequirementMatchResult {
  requirementId: string;
  conceptId: string;
  label: string;
  type: RequirementType;
  level: RequirementLevel;
  status: MatchStatus;
  matchMethod: MatchMethod;
  score: number;
  maxScore: number;
  confidence: number;
  evidence: CvEvidence[];
  explanation: string;
  improvementSuggestion?: string;
}

export interface MatchSummary {
  score: number;
  confidence: number;
  matchedCount: number;
  partialCount: number;
  notMentionedCount: number;
  missingCount: number;
}

export type JobType = "internship" | "general";

export interface JobMatchResult {
  summary: MatchSummary;
  matches: RequirementMatchResult[];
  jobType: JobType;
  suggestions: string[];
}

export type UserAnswerValue = "yes" | "no" | "unknown";
export type UserAnswers = Record<string, UserAnswerValue>;
