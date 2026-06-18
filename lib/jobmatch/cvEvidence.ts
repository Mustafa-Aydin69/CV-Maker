// lib/jobmatch/cvEvidence.ts

import type { CVData } from "@/lib/types";
import type { CvEvidence } from "./types";
import { EVIDENCE_STRENGTH } from "./constants";
import { findConceptByText } from "./concepts";

let evidenceCounter = 0;

function makeEvidence(sectionType: string, text: string, strength: number, conceptId?: string): CvEvidence {
  return { sectionId: `ev_${evidenceCounter++}`, sectionType, text: text.slice(0, 200), conceptId, strength };
}

function hasResultSignal(text: string): boolean {
  return /\d+%|azalt|artır|düşür|yüksel|iyileştir|tasarruf|reduce|increase|improve|\d+x\b/i.test(text);
}

export function extractCvEvidence(data: CVData): CvEvidence[] {
  evidenceCounter = 0;
  const ev: CvEvidence[] = [];

  for (const exp of data.experience) {
    const lines = (exp.description ?? "").split("\n").filter(Boolean);
    for (const line of lines) {
      const strength = hasResultSignal(line) ? EVIDENCE_STRENGTH.experience_with_result : EVIDENCE_STRENGTH.experience;
      ev.push(makeEvidence("experience", line, strength, findConceptByText(line)?.id));
    }
    if (exp.role) ev.push(makeEvidence("experience", exp.role, EVIDENCE_STRENGTH.experience, findConceptByText(exp.role)?.id));
  }

  for (const proj of data.projects) {
    const lines = (proj.description ?? "").split("\n").filter(Boolean);
    for (const line of lines) ev.push(makeEvidence("project", line, EVIDENCE_STRENGTH.project, findConceptByText(line)?.id));
    if (proj.stack) {
      proj.stack.split(/[,/|]/).map((s) => s.trim()).filter(Boolean).forEach((item) =>
        ev.push(makeEvidence("project", item, EVIDENCE_STRENGTH.project, findConceptByText(item)?.id))
      );
    }
  }

  for (const cat of data.skills) {
    for (const item of cat.items) ev.push(makeEvidence("skills", item, EVIDENCE_STRENGTH.skills, findConceptByText(item)?.id));
  }

  for (const edu of data.education) {
    const text = [edu.school, edu.degree, edu.field, edu.notes].filter(Boolean).join(" ");
    ev.push(makeEvidence("education", text, EVIDENCE_STRENGTH.education, findConceptByText(text)?.id));
    const isCurrentStudent = !edu.end || edu.end > new Date().toISOString().slice(0, 7);
    if (isCurrentStudent) ev.push(makeEvidence("education", `Aktif öğrenci: ${edu.school}`, EVIDENCE_STRENGTH.education, "student_status"));
  }

  for (const cert of (data.certifications ?? [])) {
    if (!cert.name) continue;
    const text = [cert.name, cert.issuer].filter(Boolean).join(" ");
    ev.push(makeEvidence("certificate", text, EVIDENCE_STRENGTH.certificate, findConceptByText(text)?.id));
  }

  for (const lang of (data.languages ?? [])) ev.push(makeEvidence("language", lang, EVIDENCE_STRENGTH.language, findConceptByText(lang)?.id));

  if (data.about?.trim()) ev.push(makeEvidence("about", data.about.slice(0, 300), EVIDENCE_STRENGTH.about, findConceptByText(data.about)?.id));

  for (const vol of (data.volunteers ?? [])) {
    const text = [vol.role, vol.organization, vol.description].filter(Boolean).join(" ");
    ev.push(makeEvidence("volunteer", text.slice(0, 200), EVIDENCE_STRENGTH.volunteer, findConceptByText(text)?.id));
  }

  for (const award of (data.awards ?? [])) {
    if (!award.title) continue;
    ev.push(makeEvidence("certificate", award.title, EVIDENCE_STRENGTH.certificate, findConceptByText(award.title)?.id));
  }

  for (const cs of (data.customSections ?? [])) {
    if (!cs.title && !cs.content) continue;
    const text = [cs.title, cs.content].filter(Boolean).join(" ");
    ev.push(makeEvidence("custom", text.slice(0, 200), EVIDENCE_STRENGTH.custom, findConceptByText(text)?.id));
  }

  return ev;
}
