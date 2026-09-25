// lib/importCv.ts — Mevcut CV dosyasından (PDF/Word/TXT) taslak veri çıkarma.
// Yalnızca iletişim bilgilerini (ad, e-posta, telefon, LinkedIn, GitHub) sezgisel olarak
// yakalar; geri kalan tüm metin "Hakkımda" alanına aktarılır ki kullanıcı hiçbir veri
// kaybetmeden düzenleyip doğru bölümlere taşıyabilsin. Tüm işlem tarayıcıda yapılır,
// hiçbir veri sunucuya gönderilmez.

import type { CVData } from "./types";
import { EMPTY_DATA } from "./defaultData";

export interface ImportResult {
  data: CVData;
  rawTextLength: number;
}

const EMAIL_RE    = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE     = /(?:\+?\d[\d\s().-]{7,}\d)/;
const LINKEDIN_RE  = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,;]+/i;
const GITHUB_RE    = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,;]+/i;

type TextItemLike = { str?: string };

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;

  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items.map((it) => (it as TextItemLike).str ?? "").join(" ");
    text += line + "\n";
  }
  return text;
}

async function extractDocxText(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) throw new Error("Word belgesi okunamadı.");

  const paragraphs = xml.split(/<\/w:p>/).map((p) => {
    const runs = Array.from(p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)).map((m) => m[1]);
    return runs.join("");
  });
  return paragraphs.filter((p) => p.trim()).join("\n");
}

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "txt")  return file.text();
  if (ext === "pdf")  return extractPdfText(file);
  if (ext === "docx") return extractDocxText(file);
  if (ext === "doc")
    throw new Error("Eski .doc formatı desteklenmiyor. Lütfen .docx, .pdf ya da .txt olarak yükleyin.");
  throw new Error("Desteklenmeyen dosya türü. PDF, Word (.docx) ya da metin (.txt) kullanın.");
}

function parseResumeText(text: string): CVData {
  const clean = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  const email    = clean.match(EMAIL_RE)?.[0] ?? "";
  const phone    = clean.match(PHONE_RE)?.[0]?.trim() ?? "";
  const linkedin = clean.match(LINKEDIN_RE)?.[0] ?? "";
  const github   = clean.match(GITHUB_RE)?.[0] ?? "";

  // İsim tahmini: ilk birkaç satır içinde iletişim bilgisi içermeyen, kısa ilk satır.
  let nameLine = "";
  for (const l of lines.slice(0, 6)) {
    if (EMAIL_RE.test(l) || PHONE_RE.test(l) || /https?:\/\//.test(l)) continue;
    if (l.length <= 40 && l.split(" ").filter(Boolean).length <= 5) { nameLine = l; break; }
  }
  const nameParts = nameLine.split(" ").filter(Boolean);
  const firstName = nameParts[0] ?? "";
  const lastName  = nameParts.slice(1).join(" ");

  // Tespit edilen alanları metinden çıkar, geri kalanı "Hakkımda"ya aktar.
  let remainder = clean;
  for (const found of [nameLine, email, phone, linkedin, github]) {
    if (found) remainder = remainder.split(found).join(" ");
  }
  remainder = remainder.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (remainder.length > 6000) remainder = remainder.slice(0, 6000) + "…";

  return {
    ...EMPTY_DATA,
    firstName,
    lastName,
    email,
    phone,
    linkedin,
    github,
    about: remainder,
    skills: [{ _id: Date.now(), name: "Diller", items: [] }],
  };
}

export async function importCvFile(file: File): Promise<ImportResult> {
  const text = await extractTextFromFile(file);
  if (!text.trim())
    throw new Error("Dosyadan metin okunamadı. Dosya taranmış bir görüntü olabilir.");
  return { data: parseResumeText(text), rawTextLength: text.length };
}

export function importCvText(text: string): ImportResult {
  if (!text.trim()) throw new Error("Yapıştırılan metin boş.");
  return { data: parseResumeText(text), rawTextLength: text.length };
}
