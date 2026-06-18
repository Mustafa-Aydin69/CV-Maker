// lib/jobmatch/index.ts

import type { CVData } from "@/lib/types";
import type { JobMatchResult, UserAnswers } from "./types";
import { MAX_JOB_TEXT_LENGTH } from "./constants";
import { stripHtml } from "./normalize";
import { classifySentences, detectJobType } from "./sections";
import { extractRequirements } from "./requirements";
import { extractCvEvidence } from "./cvEvidence";
import { matchRequirement } from "./matcher";
import { scoreMatches } from "./scoring";

export function analyzeJobMatch(
  data: CVData,
  rawJobText: string,
  userAnswers: UserAnswers = {},
): JobMatchResult {
  const jobText = stripHtml(rawJobText).slice(0, MAX_JOB_TEXT_LENGTH);
  const jobType = detectJobType(jobText);
  const sentences = classifySentences(jobText);
  const requirements = extractRequirements(sentences);
  const evidence = extractCvEvidence(data);

  const matches = requirements.map((req) => matchRequirement(req, evidence, userAnswers));
  const summary = scoreMatches(matches, jobType);

  const suggestions = matches
    .filter((m) => m.improvementSuggestion)
    .map((m) => m.improvementSuggestion as string);

  return { summary, matches, jobType, suggestions };
}

export type { JobMatchResult, UserAnswers } from "./types";
