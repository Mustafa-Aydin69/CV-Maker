// lib/jobmatch/requirements.ts

import type { ClassifiedJobSentence, JobRequirement, RequirementLevel, RequirementType } from "./types";
import { BASE_WEIGHTS } from "./constants";
import { findConceptByText } from "./concepts";

const EXPLICIT_EVIDENCE_PATTERNS: Array<{ pattern: RegExp; conceptHint: string }> = [
  { pattern: /zorunlu\s*staj/i,            conceptHint: "internship_eligibility" },
  { pattern: /staj\s*yükümlülüğü/i,        conceptHint: "internship_eligibility" },
  { pattern: /sigortanın\s*üniversite/i,   conceptHint: "university_insurance" },
  { pattern: /okul\s*sigortası/i,          conceptHint: "university_insurance" },
  { pattern: /ehliyet/i,                   conceptHint: "driving_license" },
  { pattern: /çalışma\s*izni/i,            conceptHint: "" },
  { pattern: /vatandaşlık/i,               conceptHint: "" },
  { pattern: /seyahat\s*engeli/i,          conceptHint: "" },
  { pattern: /vardiyalı/i,                 conceptHint: "" },
  { pattern: /en\s*az\s*\d+\s*yıl/i,      conceptHint: "" },
  { pattern: /\d+\s*yıl\s*(deneyim|tecrübe)/i, conceptHint: "" },
  { pattern: /b[12]\s*(seviye|level)/i,    conceptHint: "english" },
  { pattern: /c[12]\s*(seviye|level)/i,    conceptHint: "english" },
  { pattern: /ielts|toefl|yds|yökdil/i,   conceptHint: "english" },
];

function detectExplicitEvidence(text: string): { required: boolean; conceptHint: string } {
  for (const { pattern, conceptHint } of EXPLICIT_EVIDENCE_PATTERNS) {
    if (pattern.test(text)) return { required: true, conceptHint };
  }
  return { required: false, conceptHint: "" };
}

function detectLevel(sentence: ClassifiedJobSentence): RequirementLevel {
  const lower = sentence.text.toLowerCase();
  if (/tercihen|tercih\s*edilir|nice\s*to\s*have|preferred|plus\b|avantaj|bonus/.test(lower)) return "preferred";
  if (/zorunlu|gerekli|olmalı|required|must/.test(lower)) return "mandatory";
  return sentence.category === "mandatory_requirement" ? "mandatory" : "preferred";
}

function detectType(text: string, conceptCategory?: string): RequirementType {
  const lower = text.toLowerCase();
  if (/zorunlu\s*staj|staj\s*yükümlülüğü|sigorta|öğrenci|student|ehliyet|çalışma\s*izni|vatandaşlık/.test(lower))
    return "eligibility";
  if (/ingilizce|almanca|fransızca|english|german|yabancı\s*dil|ielts|toefl/.test(lower))
    return "language";
  if (/sertifika|certificate|aws\s*certified|cisco|comptia|pmp/.test(lower))
    return "certificate";
  if (/eğitim|mezun|üniversite|lisans|yüksek\s*lisans|doktora|education|degree/.test(lower))
    return "education";
  if (/\d+\s*yıl\s*(deneyim|tecrübe)|years?\s*of\s*experience|kıdemli|senior/.test(lower))
    return "experience";
  if (conceptCategory === "soft_skill") return "soft_skill";
  if (conceptCategory === "tool") return "tool";
  if (conceptCategory === "domain") return "domain";
  return "hard_skill";
}

function makeFallbackLabel(text: string): string {
  const t = text.trim().replace(/^[-•*·▪►✓✔\d+\.\)]\s*/, "");
  return t.length > 80 ? t.slice(0, 77) + "…" : t;
}

let reqCounter = 0;

export function extractRequirements(sentences: ClassifiedJobSentence[]): JobRequirement[] {
  reqCounter = 0;
  const requirements: JobRequirement[] = [];
  const seen = new Set<string>();

  for (const sentence of sentences) {
    if (!sentence.isCandidateRequirement) continue;

    const concept = findConceptByText(sentence.text);
    const { required: requiresExplicit, conceptHint } = detectExplicitEvidence(sentence.text);
    const effectiveConceptId = concept?.id ?? conceptHint ?? `unknown_${reqCounter}`;
    const label = concept?.label ?? makeFallbackLabel(sentence.text);

    if (concept && seen.has(concept.id)) continue;
    if (concept) seen.add(concept.id);

    const level = detectLevel(sentence);
    const type = detectType(sentence.text, concept?.category);
    const weight = BASE_WEIGHTS[level][type];

    requirements.push({
      id: `req_${reqCounter++}`,
      conceptId: effectiveConceptId,
      label,
      type,
      level,
      weight,
      aliases: concept?.aliases ?? [],
      relatedConceptIds: concept?.related ?? [],
      sourceText: sentence.text,
      sourceSection: sentence.sourceSection,
      confidence: sentence.confidence,
      requiresExplicitEvidence: requiresExplicit,
    });
  }

  return requirements;
}
