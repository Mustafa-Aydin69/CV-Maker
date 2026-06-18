// lib/jobmatch/constants.ts

import type { MatchMethod, RequirementType, RequirementLevel } from "./types";

export const MAX_JOB_TEXT_LENGTH = 8000;
export const MIN_JOB_TEXT_LENGTH = 50;
export const CONFIRMED_MISSING_SCORE_CAP = 60;
export const SEMANTIC_MIN_TOKEN_LENGTH = 4;

export const MATCH_MULTIPLIERS: Record<MatchMethod, number> = {
  exact:                1.00,
  alias:                0.92,
  related:              0.75,
  semantic:             0.60,
  explicit_user_answer: 1.00,
  none:                 0,
};

export const EVIDENCE_STRENGTH: Record<string, number> = {
  experience_with_result: 1.00,
  experience:             0.90,
  project:                0.90,
  certificate:            0.75,
  education:              0.75,
  skills:                 0.70,
  language:               0.85,
  volunteer:              0.70,
  about:                  0.60,
  custom:                 0.60,
  semantic:               0.50,
};

export const INTERNSHIP_CATEGORY_WEIGHTS: Record<string, number> = {
  eligibility:          0.40,
  hardSkillAndTool:     0.25,
  domain:               0.15,
  educationAndProject:  0.10,
  softSkill:            0.10,
};

export const GENERAL_JOB_CATEGORY_WEIGHTS: Record<string, number> = {
  eligibility:              0.15,
  hardSkillAndTool:         0.35,
  experience:               0.20,
  educationAndCertificate:  0.10,
  domain:                   0.10,
  softSkill:                0.10,
};

export const TYPE_TO_CATEGORY_GROUP: Record<RequirementType, string> = {
  eligibility:  "eligibility",
  hard_skill:   "hardSkillAndTool",
  tool:         "hardSkillAndTool",
  education:    "educationAndProject",
  experience:   "experience",
  language:     "hardSkillAndTool",
  certificate:  "educationAndCertificate",
  domain:       "domain",
  soft_skill:   "softSkill",
};

export const BASE_WEIGHTS: Record<RequirementLevel, Record<RequirementType, number>> = {
  mandatory: {
    eligibility: 10, hard_skill: 8, tool: 6, education: 7,
    experience: 9, language: 7, certificate: 6, domain: 3, soft_skill: 5,
  },
  preferred: {
    eligibility: 5, hard_skill: 5, tool: 4, education: 4,
    experience: 5, language: 4, certificate: 4, domain: 2, soft_skill: 3,
  },
  contextual: {
    eligibility: 2, hard_skill: 2, tool: 2, education: 2,
    experience: 2, language: 2, certificate: 2, domain: 1, soft_skill: 1,
  },
};
