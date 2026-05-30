// lib/keywords.ts — İş ilanı anahtar kelime eşleştirme (client-side)

import type { CVData } from "./types";

// ── Stop-word listesi ─────────────────────────────────────────────────────────
// İş ilanlarında sıkça geçen ama beceri/teknoloji olmayan kelimeler de dahil
const STOP_WORDS = new Set([
  // ── Türkçe dilbilgisi ──────────────────────────────────────────────────────
  "ve","bir","bu","da","de","için","ile","olan","gibi","çok","en","her",
  "o","ben","biz","siz","onlar","ama","fakat","veya","ya","ancak","ise",
  "ki","daha","bazı","tüm","hiç","pek","ne","nasıl","neden","kim","nerede",
  "hangi","olarak","den","dan","nin","nın","nun","nün","te","ta","mi","mı",
  "mu","mü","dir","dır","dur","dür","tir","tır","tur","tür","kadar","sonra",
  "önce","üzere","göre","karşı","rağmen","hem","şu","sen","beni","seni",
  "onu","bizi","sizi","onları","bende","sende","onda","bizde","sizde","onlarda",
  // ── Türkçe iş ilanı klişeleri ─────────────────────────────────────────────
  "deneyim","deneyimli","deneyime","tecrübe","tecrübeli","tecrübeye",
  "arıyoruz","aramaktayız","aranmaktadır","aranıyor","başvurabilirsiniz",
  "başvurabilir","bekliyoruz","beklentilerimiz","gereklidir","gerekli",
  "gereksinimler","nitelikler","tercih","tercihli","tercihen","tercih edilir",
  "pozisyon","pozisyona","pozisyonu","görev","görevler","rol","roller",
  "çalışmak","çalışacak","çalışıyor","çalışanlar","çalışan","çalışma",
  "işbirliği","ortam","ortamında","ekip","ekibin","ekibiyle","ekibimiz",
  "yıl","yıllık","yılı","yılından","ay","aylık","süre","tam","yarı",
  "iyi","güçlü","mükemmel","üstün","başarılı","yetkin","nitelikli",
  "olumlu","verimli","esnek","dinamik","hızlı","analitik","detaylı",
  "sorumluluk","sorumluluklar","sorumlu","takım","proje","projelerin",
  "bilgi","bilgisi","bilgiye","sahip","olmalı","olmalıdır","sahip olmak",
  "yönetim","yönetimi","yönetmek","koordinasyon","iletişim","raporlama",
  "katkı","katkıda","gelişim","gelişme","büyüme","fırsatlar","fırsat",
  "neden","bize","katıl","katılın","ofis","uzaktan","hibrit","maaş",
  "prim","yan","haklar","sigorta","başvuru","iletişim","için",
  // ── İngilizce dilbilgisi ──────────────────────────────────────────────────
  "the","a","an","of","in","to","for","and","or","with","on","at","by",
  "from","as","is","are","was","be","have","has","will","can","that","this",
  "it","you","we","they","their","our","your","its","not","but","if","then",
  "so","do","does","did","would","could","should","may","might","must",
  "who","what","when","where","how","which","about","into","through",
  "during","until","against","among","throughout","whether","before","after",
  "above","below","between","both","each","few","more","most","other",
  "some","such","only","own","same","than","too","very","just","while",
  // ── İngilizce iş ilanı klişeleri ─────────────────────────────────────────
  "experience","experienced","years","year","months","month","minimum",
  "required","requirement","requirements","preferred","preferably","nice",
  "strong","excellent","good","great","solid","deep","proven","hands",
  "looking","seeking","join","candidate","applicant","position","role",
  "team","company","office","remote","hybrid","onsite","full","part","time",
  "responsibilities","qualifications","skills","ability","able","capable",
  "work","working","worked","job","opportunity","opportunities","career",
  "includes","including","following","will","also","well","plus","bonus",
  "benefits","salary","compensation","culture","fast","dynamic","exciting",
  "build","create","develop","design","manage","lead","own","drive","help",
  "support","ensure","provide","deliver","contribute","collaborate","partner",
  "using","within","across","multiple","various","day","today","new",
  "based","focus","focused","primary","key","core","main","daily","regular",
  "closely","report","reporting","directly","indirectly","closely","with",
  "relevant","related","equivalent","applicable","considered","advantage",
  "background","familiarity","knowledge","understanding","passion","excited",
  "motivated","self","starter","learner","fast","motivated","driven",
]);

// ── Teknik terim tespiti ───────────────────────────────────────────────────────
// Bu desenlere uyan kelimeler frekans filtresinden muaf tutulur
const TECH_PATTERN = /[0-9+#]/; // sayı veya özel char içeriyorsa teknik kabul et

function isTechTerm(w: string): boolean {
  return w.length >= 5 || TECH_PATTERN.test(w);
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/c\+\+/g,      "cplusplus")
    .replace(/c#/g,          "csharp")
    .replace(/\.net\b/g,    "dotnet")
    .replace(/node\.js/g,   "nodejs")
    .replace(/next\.js/g,   "nextjs")
    .replace(/vue\.js/g,    "vuejs")
    .replace(/react\.js/g,  "reactjs")
    .replace(/nuxt\.js/g,   "nuxtjs")
    .replace(/express\.js/g,"expressjs")
    .replace(/tailwind\s*css/gi, "tailwindcss")
    .replace(/\bhtml\s*\/\s*css\b/gi, "htmlcss")
    .replace(/[^a-z0-9çğıöşü\s]/g, " ");
}

/** CV için basit tokenizer — tüm anlamlı kelimeleri çıkarır */
function tokenizeCV(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
  );
}

/**
 * İş ilanı için akıllı tokenizer:
 * - Stop-word filtresi
 * - Min uzunluk 4 (kısa genel kelimeleri dışarıda bırak)
 * - Frekans filtresi: sadece ≥2 kez geçen veya teknik terim sayılan kelimeler
 *   anahtar kelime olarak sayılır
 */
function tokenizeJob(text: string): Set<string> {
  const words = normalize(text)
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  // Frekans sayımı
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  // Filtre: teknik terim VEYA en az 2 kez geçen kelimeler
  const result = new Set<string>();
  for (const [w, cnt] of freq) {
    if (isTechTerm(w) || cnt >= 2) result.add(w);
  }
  return result;
}

// ── CV metni çıkarıcı ─────────────────────────────────────────────────────────

export function extractCvText(data: CVData): string {
  const parts: string[] = [
    data.firstName, data.lastName, data.title, data.about,
    ...data.experience.flatMap((e) => [e.role, e.company, e.location, e.description]),
    ...data.education.flatMap((e) => [e.school, e.degree, e.field, e.notes]),
    ...data.projects.flatMap((p) => [p.name, p.stack, p.description]),
    ...(data.certifications ?? []).flatMap((c) => [c.name, c.issuer]),
    ...(data.awards ?? []).flatMap((a) => [a.title, a.issuer, a.note]),
    ...data.skills.flatMap((s) => [s.name, ...s.items]),
    ...(data.languages ?? []),
    ...(data.volunteers ?? []).flatMap((v) => [v.role, v.organization, v.description]),
    ...(data.customSections ?? []).flatMap((cs) => [cs.title, cs.content]),
  ];
  return parts.filter(Boolean).join(" ");
}

// ── Ortak önek eşleştirmesi (Türkçe çekim ekleri için) ──────────────────────
// Türkçe kelimeler çekimlenince aynı kök farklı formlara girer:
// "teknoloji" → teknolojilerinin, teknolojilerine, teknolojiye …
// 7+ harflik ortak önek varsa "aynı sözcük" sayılır.
const MIN_PREFIX = 7;

function sharedPrefixLen(a: string, b: string): number {
  const limit = Math.min(a.length, b.length);
  let i = 0;
  while (i < limit && a[i] === b[i]) i++;
  return i;
}

/** CV token seti içinde jobToken için eşleşme arar (tam veya köke dayalı) */
function matchesCV(cvTokens: Set<string>, jobToken: string): boolean {
  // 1) Tam eşleşme (İngilizce teknik terimler için hızlı yol)
  if (cvTokens.has(jobToken)) return true;

  // 2) Ortak önek eşleştirmesi (Türkçe çekim ekleri için)
  //    Kısa kelimelerde yanlış pozitif riski yüksek olduğundan sadece her iki
  //    taraf da MIN_PREFIX uzunluğundaysa kontrol et
  if (jobToken.length < MIN_PREFIX) return false;

  for (const cv of cvTokens) {
    if (cv.length < MIN_PREFIX) continue;
    if (sharedPrefixLen(cv, jobToken) >= MIN_PREFIX) return true;
  }

  return false;
}

// ── Eşleştirme ────────────────────────────────────────────────────────────────

export interface KeywordResult {
  matched: string[];
  missing: string[];
  score: number; // 0–100
}

/**
 * CV metni ile iş ilanı arasında akıllı anahtar kelime eşleştirmesi yapar.
 *
 * - İlandan yalnızca teknik veya sık geçen kelimeler aday olarak seçilir.
 * - Türkçe çekim ekleri: 7+ harflik ortak önek varsa eşleşmiş sayılır.
 *   ("teknolojilerinin" ↔ "teknoloji", "mühendislerini" ↔ "mühendis" vb.)
 */
export function matchKeywords(cvText: string, jobText: string): KeywordResult {
  if (!jobText.trim()) return { matched: [], missing: [], score: 0 };

  const cvTokens  = tokenizeCV(cvText);
  const jobTokens = tokenizeJob(jobText);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobTokens) {
    (matchesCV(cvTokens, kw) ? matched : missing).push(kw);
  }

  // Uzun kelimeler öne (daha spesifik = daha önemli)
  const byLength = (a: string, b: string) => b.length - a.length || a.localeCompare(b, "tr");
  matched.sort(byLength);
  missing.sort(byLength);

  const total = matched.length + missing.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);

  return { matched, missing, score };
}
