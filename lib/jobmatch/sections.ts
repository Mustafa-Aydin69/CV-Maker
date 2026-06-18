// lib/jobmatch/sections.ts

import type { ClassifiedJobSentence, JobSentenceCategory } from "./types";

const HIGH_SIGNAL_HEADINGS = [
  /aranan\s*(nitelik|özellik|kriter)/i,
  /kimler\s*başvurabilir/i,
  /kimleri?\s*arıyoruz/i,
  /neler\s*arıyoruz/i,
  /aran(an|ılan)\s*(aday|profil|nitelik)/i,
  /aday\s*profil/i,
  /adaylarımızda\s*aran/i,
  /sizden\s*beklentilerimiz/i,
  /başvurabilmek\s*için/i,
  /başvurmanız\s*için/i,
  /gereksinim(ler)?/i,
  /requirements?/i,
  /qualifications?/i,
  /what\s*you('ll)?\s*need/i,
  /aradığımız\s*(özellik|nitelik|aday)/i,
  /genel\s*nitelik/i,
  /adayda\s*aran/i,
  /beklentilerimiz/i,
  /tercih\s*edilen\s*nitelik/i,
  /preferred\s*qualifications?/i,
  /minimum\s*qualifications?/i,
];

const IGNORE_SECTION_PATTERNS = [
  /hakkımızda/i,
  /biz\s*kimiz/i,
  /şirket(imiz)?\s*(hakkında|tanıtım)/i,
  /seni\s*neler\s*bekliyor/i,
  /sunduğumuz\s*(imkan|fırsat|avantaj)/i,
  /başvuru\s*(süreci|aşamalar)/i,
  /süreç\s*aşamaları/i,
  /about\s*us/i,
  /who\s*we\s*are/i,
  /life\s*at/i,
  /benefits?/i,
  /neden\s*(biz|bize\s*katıl)/i,
];

const REQUIREMENT_PATTERNS = [
  /sahip\s*olmak/i, /sahip\s*olan/i, /bilgisi\s*olan/i, /bilgisine\s*sahip/i,
  /\bsahip\s+aday/i, /becerisine\s+sahip/i, /yetkinliğine\s+sahip/i,
  /tecrübeli/i, /deneyimli/i, /kullanabilen/i, /kullanma\s*konusunda/i,
  /hakim\s*(olan)?/i, /mezunu/i, /öğrencisi/i, /öğrenciler/i,
  /zorunlu\s*staj/i, /staj\s*yükümlülüğü/i, /aranmaktadır/i, /tercihen/i,
  /en\s*az\s*\d+\s*yıl/i, /iyi\s*derecede/i, /bilen/i, /arıyoruz/i,
  /\baday(lar|ları|yı|yi|yu|yü|ya|ye)?\b/i,
  /yatkın/i, /\bodaklı/i, /hedefleyen/i, /benimseyenler/i,
  /potansiyeli\s+taşıyan/i, /inisiyatif\s+(kullanabilen|alan)/i,
  /required/i, /experience\s*with/i, /knowledge\s*of/i, /familiar\s*with/i,
  /proficient\s*in/i, /must\s*have/i,
];

const PREFERRED_PATTERNS = [
  /tercihen/i, /tercih\s*edilir/i, /nice\s*to\s*have/i, /preferred/i,
  /plus\b/i, /avantaj/i, /artı/i, /bonus/i,
];

type SectionTag = "high_signal" | "ignore" | "company_intro" | "neutral";

interface Section {
  heading: string;
  tag: SectionTag;
  lines: string[];
}

function ignoreSectionCategory(heading: string): JobSentenceCategory {
  if (/başvuru|süreç|process/i.test(heading)) return "application_process";
  if (/fayda|imkan|fırsat|benefit|offer/i.test(heading)) return "benefit";
  if (/hakkımız|kimiz|about|neden biz/i.test(heading)) return "company_description";
  return "marketing";
}

function detectSectionTag(heading: string): SectionTag {
  if (HIGH_SIGNAL_HEADINGS.some((p) => p.test(heading))) return "high_signal";
  if (IGNORE_SECTION_PATTERNS.some((p) => p.test(heading))) return "ignore";
  return "neutral";
}

function isHeading(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 80) return false;
  if (/[.,:;]$/.test(t)) return false;
  if (t.endsWith("?") || /^[A-ZÇĞİÖŞÜ]/.test(t) || t === t.toUpperCase()) return true;
  return false;
}

function splitIntoSections(text: string): Section[] {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section = { heading: "", tag: "neutral", lines: [] };

  for (const line of lines) {
    if (isHeading(line)) {
      if (current.lines.length > 0 || current.heading) sections.push(current);
      current = { heading: line, tag: detectSectionTag(line), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0 || current.heading) sections.push(current);

  if (sections.length > 0 && !sections[0].heading && sections[0].lines.length > 2) {
    sections[0].tag = "company_intro";
  }
  return sections;
}

function classifyLine(
  line: string,
  sectionTag: SectionTag,
  sectionHeading: string,
  id: string,
): ClassifiedJobSentence {
  if (sectionTag === "ignore" || sectionTag === "company_intro") {
    const cat: JobSentenceCategory =
      sectionTag === "ignore" ? ignoreSectionCategory(sectionHeading) : "company_description";
    return { id, text: line, category: cat, importance: 0, isCandidateRequirement: false,
             sourceSection: sectionHeading || undefined, confidence: 0.9 };
  }

  const hasReq  = REQUIREMENT_PATTERNS.some((p) => p.test(line));
  const hasPref = PREFERRED_PATTERNS.some((p) => p.test(line));
  const isBullet = /^[-•*·▪►✓✔\d+\.\)]/.test(line);
  const isHighSignal = sectionTag === "high_signal";

  let isCandidateRequirement = false;
  let importance = 0;
  let category: JobSentenceCategory = "other";
  let confidence = 0.5;

  if (isHighSignal) {
    if (isBullet || hasReq || line.length > 10) {
      isCandidateRequirement = true;
      importance = hasPref ? 0.5 : 0.8;
      category = hasPref ? "preferred_requirement" : "mandatory_requirement";
      confidence = isBullet || hasReq ? 0.85 : 0.7;
    }
  } else if (hasReq) {
    isCandidateRequirement = true;
    importance = hasPref ? 0.45 : 0.65;
    category = hasPref ? "preferred_requirement" : "mandatory_requirement";
    confidence = 0.65;
  } else if (isBullet) {
    category = "responsibility";
    importance = 0.2;
    confidence = 0.6;
  }

  return { id, text: line, category, importance, isCandidateRequirement,
           sourceSection: sectionHeading || undefined, confidence };
}

export function classifySentences(text: string): ClassifiedJobSentence[] {
  const sections = splitIntoSections(text);
  const result: ClassifiedJobSentence[] = [];
  let idx = 0;
  for (const section of sections) {
    for (const line of section.lines) {
      if (line.trim()) result.push(classifyLine(line, section.tag, section.heading, `s${idx++}`));
    }
  }
  return result;
}

export function detectJobType(text: string): "internship" | "general" {
  const signals = [/staj/i, /intern/i, /öğrenci/i, /student/i, /zorunlu\s*staj/i, /yarı zamanlı/i];
  return signals.filter((p) => p.test(text)).length >= 2 ? "internship" : "general";
}
