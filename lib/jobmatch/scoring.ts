// lib/jobmatch/scoring.ts

import type { RequirementMatchResult, MatchSummary, JobType } from "./types";
import {
  INTERNSHIP_CATEGORY_WEIGHTS, GENERAL_JOB_CATEGORY_WEIGHTS,
  TYPE_TO_CATEGORY_GROUP, CONFIRMED_MISSING_SCORE_CAP,
} from "./constants";

function calculateCategoryScore(matches: RequirementMatchResult[]): number {
  const totalMax = matches.reduce((sum, m) => sum + m.maxScore, 0);
  if (totalMax === 0) return 100;
  return (matches.reduce((sum, m) => sum + m.score, 0) / totalMax) * 100;
}

export function scoreMatches(results: RequirementMatchResult[], jobType: JobType): MatchSummary {
  const weights = jobType === "internship" ? INTERNSHIP_CATEGORY_WEIGHTS : GENERAL_JOB_CATEGORY_WEIGHTS;
  const determinable = results.filter((r) => r.status !== "not_mentioned");
  const notMentioned = results.filter((r) => r.status === "not_mentioned");

  const groups: Record<string, RequirementMatchResult[]> = {};
  for (const r of determinable) {
    const group = TYPE_TO_CATEGORY_GROUP[r.type] ?? "hardSkillAndTool";
    if (!groups[group]) groups[group] = [];
    groups[group].push(r);
  }

  let weightedSum = 0;
  let usedWeight = 0;
  for (const [groupKey, groupWeight] of Object.entries(weights)) {
    const groupMatches = groups[groupKey] ?? [];
    if (groupMatches.length === 0) continue;
    weightedSum += calculateCategoryScore(groupMatches) * groupWeight;
    usedWeight += groupWeight;
  }

  let finalScore = usedWeight > 0 ? Math.round(weightedSum / usedWeight) : 0;

  const hasCriticalMissing = results.some((r) => r.status === "confirmed_missing" && r.level === "mandatory");
  if (hasCriticalMissing) finalScore = Math.min(finalScore, CONFIRMED_MISSING_SCORE_CAP);

  return {
    score: finalScore,
    confidence: results.length === 0 ? 0 : Math.round((determinable.length / results.length) * 100),
    matchedCount:      results.filter((r) => r.status === "matched").length,
    partialCount:      results.filter((r) => r.status === "partial_match").length,
    notMentionedCount: notMentioned.length,
    missingCount:      results.filter((r) => r.status === "confirmed_missing").length,
  };
}
