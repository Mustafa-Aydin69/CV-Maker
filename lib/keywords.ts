// lib/keywords.ts — İş ilanı anahtar kelime eşleştirme (client-side)

import type { CVData } from "./types";

// Türkçe + İngilizce yaygın stop-word'ler
const STOP_WORDS = new Set([
  // Türkçe
  "ve","bir","bu","da","de","için","ile","olan","gibi","çok","en","her","o",
  "ben","biz","siz","onlar","ama","fakat","veya","ya","ancak","ise","ki",
  "daha","bazı","tüm","hiç","pek","ne","nasıl","neden","kim","nerede",
  "hangi","olan","olarak","olan","den","dan","nin","nın","nun","nün",
  "te","ta","mi","mı","mu","mü","dir","dır","dur","dür","tir","tır",
  "tur","tür","ile","kadar","sonra","önce","üzere","göre","karşı","rağmen",
  "hem","ya","ya","ya","ne","de","da","ki","mi","mu","mü","mı","mı",
  "bu","şu","o","ben","sen","o","biz","siz","onlar","beni","seni","onu",
  "bizi","sizi","onları","bende","sende","onda","bizde","sizde","onlarda",
  // İngilizce
  "the","a","an","of","in","to","for","and","or","with","on","at","by",
  "from","as","is","are","was","be","have","has","will","can","that","this",
  "it","you","we","they","their","our","your","its","not","but","if","then",
  "so","do","does","did","would","could","should","may","might","must",
  "who","what","when","where","how","which","about","into","through",
  "during","including","until","against","among","throughout","despite",
  "whether","before","after","above","below","between","both","each",
  "few","more","most","other","some","such","only","own","same","than",
  "too","very","just","because","while","although",
]);

/** Teknik kısaltmaları normalize et, sonra tokenize et */
function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    // Yaygın tech token'ları koru
    .replace(/c\+\+/g, "cplusplus")
    .replace(/c#/g, "csharp")
    .replace(/\.net\b/g, "dotnet")
    .replace(/node\.js/g, "nodejs")
    .replace(/next\.js/g, "nextjs")
    .replace(/vue\.js/g, "vuejs")
    .replace(/react\.js/g, "reactjs")
    .replace(/express\.js/g, "expressjs")
    .replace(/\bhtml\/css\b/g, "htmlcss")
    // Noktalama temizle
    .replace(/[^a-zA-Z0-9çğıöşüçğişöü\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  return new Set(tokens);
}

/** CV'deki tüm metni tek string olarak döndürür */
export function extractCvText(data: CVData): string {
  const parts: string[] = [
    data.firstName,
    data.lastName,
    data.title,
    data.about,
    ...data.experience.flatMap((e) => [e.role, e.company, e.location, e.description]),
    ...data.education.flatMap((e) => [e.school, e.degree, e.field, e.notes]),
    ...data.projects.flatMap((p) => [p.name, p.stack, p.description]),
    ...(data.certifications ?? []).flatMap((c) => [c.name, c.issuer]),
    ...(data.awards ?? []).flatMap((a) => [a.title, a.issuer, a.note]),
    ...data.skills.flatMap((s) => [s.name, ...s.items]),
    ...(data.languages ?? []),
  ];
  return parts.filter(Boolean).join(" ");
}

export interface KeywordResult {
  matched: string[];
  missing: string[];
  score: number; // 0–100
}

/**
 * CV metni ile iş ilanı metni arasında anahtar kelime eşleştirmesi yapar.
 * Sadece ilandaki token'lar temel alınır; CV'deki fazladan token'lar görmezden gelinir.
 */
export function matchKeywords(cvText: string, jobText: string): KeywordResult {
  if (!jobText.trim()) return { matched: [], missing: [], score: 0 };

  const cvTokens  = tokenize(cvText);
  const jobTokens = tokenize(jobText);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobTokens) {
    if (cvTokens.has(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  // Sıkça geçen önemsiz token'ları öne çıkarma — frekans sıralaması yerine
  // alfabetik + uzun-önce sıralama (görsel netlik için)
  matched.sort((a, b) => b.length - a.length || a.localeCompare(b));
  missing.sort((a, b) => b.length - a.length || a.localeCompare(b));

  const total = matched.length + missing.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);

  return { matched, missing, score };
}
