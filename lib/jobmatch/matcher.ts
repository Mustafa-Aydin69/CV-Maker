// lib/jobmatch/matcher.ts

import type {
  JobRequirement, CvEvidence, RequirementMatchResult,
  MatchMethod, MatchStatus, UserAnswers,
} from "./types";
import { MATCH_MULTIPLIERS } from "./constants";
import { findConceptById } from "./concepts";
import { searchableOf, tokenize } from "./normalize";

function evidenceMatchesConceptId(ev: CvEvidence, conceptId: string): boolean {
  return ev.conceptId === conceptId;
}

function evidenceMatchesAlias(ev: CvEvidence, aliases: string[]): boolean {
  const s = searchableOf(ev.text);
  return aliases.some((alias) => { const a = searchableOf(alias); return a.length >= 3 && s.includes(a); });
}

function evidenceMatchesRelated(ev: CvEvidence, relatedIds: string[]): boolean {
  return !!ev.conceptId && relatedIds.includes(ev.conceptId);
}

function semanticOverlap(evidenceText: string, reqText: string, reqAliases: string[]): boolean {
  const evTokens = new Set(tokenize(evidenceText));
  const reqTokens = tokenize(reqText + " " + reqAliases.join(" "));
  return reqTokens.filter((t) => evTokens.has(t)).length >= 2;
}

function buildExplanation(label: string, method: MatchMethod, status: MatchStatus, evidence: CvEvidence[]): string {
  const src = evidence[0]?.text ? ` Kaynak: "${evidence[0].text.slice(0, 70)}"` : "";
  if (status === "matched") {
    const methodLabels: Record<string, string> = {
      exact: "Doğrudan eşleşme", alias: "Eş anlamlı ifade",
      related: "İlişkili beceri", semantic: "Anlam olarak benzer içerik",
      explicit_user_answer: "Kullanıcı onayı",
    };
    return `${methodLabels[method] ?? "Eşleşme"} bulundu.${src}`;
  }
  if (status === "partial_match") return `Kısmi kanıt bulundu.${src}`;
  if (status === "not_mentioned") return `"${label}" hakkında CV'de bilgi bulunmuyor. Adayda olmadığı anlamına gelmez.`;
  if (status === "confirmed_missing") return "Kullanıcı bu kriteri karşılamadığını belirtti.";
  return "";
}

function buildSuggestion(status: MatchStatus, method: MatchMethod, req: JobRequirement, evidence: CvEvidence[]): string | undefined {
  if (status === "confirmed_missing") return undefined;
  if (status === "not_mentioned") {
    return req.requiresExplicitEvidence
      ? "Bu bilgi size uygunsa CV'nize ekleyebilirsiniz; uygun değilse kesinlikle eklemeyin."
      : undefined;
  }
  if (status === "partial_match") {
    const ev = evidence[0];
    return ev ? `CV'nizdeki "${ev.text.slice(0, 50)}" ifadesini "${req.label}" bağlamıyla daha açık ifade edebilirsiniz.` : undefined;
  }
  if (status === "matched" && (method === "alias" || method === "related")) {
    const ev = evidence[0];
    return ev ? `İlandaki "${req.label}" terimiyle CV'nizdeki ifadeyi ("${ev.text.slice(0, 40)}") daha açık eşleştirebilirsiniz.` : undefined;
  }
  return undefined;
}

export function matchRequirement(req: JobRequirement, evidence: CvEvidence[], userAnswers: UserAnswers): RequirementMatchResult {
  const maxScore = req.weight;
  const userAnswer = userAnswers[req.id];

  if (userAnswer === "yes") {
    return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
             status: "matched", matchMethod: "explicit_user_answer", score: maxScore * MATCH_MULTIPLIERS.explicit_user_answer,
             maxScore, confidence: 1.0, evidence: [], explanation: "Kullanıcı bu kriteri karşıladığını belirtti." };
  }
  if (userAnswer === "no") {
    return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
             status: "confirmed_missing", matchMethod: "none", score: 0, maxScore, confidence: 1.0, evidence: [],
             explanation: "Kullanıcı bu kriteri karşılamadığını belirtti." };
  }

  // Exact
  const exactMatches = evidence.filter((ev) => evidenceMatchesConceptId(ev, req.conceptId));
  if (exactMatches.length > 0) {
    const best = exactMatches.reduce((a, b) => (a.strength > b.strength ? a : b));
    const score = Math.min(maxScore, maxScore * MATCH_MULTIPLIERS.exact * best.strength);
    const status: MatchStatus = score >= maxScore * 0.7 ? "matched" : "partial_match";
    return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
             status, matchMethod: "exact", score, maxScore, confidence: req.confidence,
             evidence: exactMatches.slice(0, 3), explanation: buildExplanation(req.label, "exact", status, exactMatches),
             improvementSuggestion: buildSuggestion(status, "exact", req, exactMatches) };
  }

  // Alias
  const aliasMatches = evidence.filter((ev) => evidenceMatchesAlias(ev, req.aliases));
  if (aliasMatches.length > 0) {
    const best = aliasMatches.reduce((a, b) => (a.strength > b.strength ? a : b));
    const score = Math.min(maxScore, maxScore * MATCH_MULTIPLIERS.alias * best.strength);
    const status: MatchStatus = score >= maxScore * 0.6 ? "matched" : "partial_match";
    return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
             status, matchMethod: "alias", score, maxScore, confidence: req.confidence * 0.95,
             evidence: aliasMatches.slice(0, 3), explanation: buildExplanation(req.label, "alias", status, aliasMatches),
             improvementSuggestion: buildSuggestion(status, "alias", req, aliasMatches) };
  }

  // Related
  if ((req.relatedConceptIds ?? []).length > 0) {
    const relatedMatches = evidence.filter((ev) => evidenceMatchesRelated(ev, req.relatedConceptIds ?? []));
    if (relatedMatches.length > 0) {
      const best = relatedMatches.reduce((a, b) => (a.strength > b.strength ? a : b));
      const score = Math.min(maxScore, maxScore * MATCH_MULTIPLIERS.related * best.strength);
      const relatedConcept = findConceptById(best.conceptId ?? "");
      return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
               status: "partial_match", matchMethod: "related", score, maxScore, confidence: req.confidence * 0.85,
               evidence: relatedMatches.slice(0, 3),
               explanation: `CV'de ilişkili kavram (${relatedConcept?.label ?? best.text.slice(0, 40)}) bulundu. "${req.label}" ile bağlantılı.`,
               improvementSuggestion: buildSuggestion("partial_match", "related", req, relatedMatches) };
    }
  }

  // Semantic (requiresExplicitEvidence ise geçersiz)
  if (!req.requiresExplicitEvidence) {
    const semanticMatches = evidence.filter((ev) => semanticOverlap(ev.text, req.sourceText, req.aliases));
    if (semanticMatches.length > 0) {
      const best = semanticMatches.reduce((a, b) => (a.strength > b.strength ? a : b));
      const score = Math.min(maxScore, maxScore * MATCH_MULTIPLIERS.semantic * best.strength);
      return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
               status: "partial_match", matchMethod: "semantic", score, maxScore, confidence: req.confidence * 0.6,
               evidence: semanticMatches.slice(0, 2), explanation: buildExplanation(req.label, "semantic", "partial_match", semanticMatches),
               improvementSuggestion: buildSuggestion("partial_match", "semantic", req, semanticMatches) };
    }
  }

  // Not mentioned
  return { requirementId: req.id, conceptId: req.conceptId, label: req.label, type: req.type, level: req.level,
           status: "not_mentioned", matchMethod: "none", score: 0, maxScore, confidence: req.confidence * 0.5,
           evidence: [], explanation: buildExplanation(req.label, "none", "not_mentioned", []),
           improvementSuggestion: buildSuggestion("not_mentioned", "none", req, []) };
}
