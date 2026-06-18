// lib/jobmatch/normalize.ts

import type { NormalizedText } from "./types";
import { SEMANTIC_MIN_TOKEN_LENGTH } from "./constants";

const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I",
  ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
};

function toSearchable(s: string): string {
  return s
    .toLowerCase()
    .replace(/[çğışöüÇĞIŞÖÜ]/g, (c) => (TR_MAP[c] ?? c).toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ");
}

const STOP_TOKENS = new Set([
  "ve","bir","bu","da","de","için","ile","olan","gibi","her","veya","ancak",
  "ise","ki","daha","tüm","ne","nasıl","neden","kim","hangi","olarak","kadar",
  "sonra","önce","biz","siz","onlar","ben","sen","the","a","an","of","in","to",
  "for","and","or","with","on","at","by","is","are","be","have","has","will",
  "can","that","this","it","you","we","they","not","but","if","so","do","does",
]);

export function tokenize(text: string): string[] {
  return toSearchable(text)
    .split(/\s+/)
    .filter((t) => t.length >= SEMANTIC_MIN_TOKEN_LENGTH && !STOP_TOKENS.has(t) && !/^\d+$/.test(t));
}

export function normalizeText(raw: string): NormalizedText {
  const clean = stripHtml(raw).replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  const searchable = toSearchable(clean);
  const tokens = tokenize(clean);
  return { original: clean, lower, searchable, tokens };
}

export function searchableOf(s: string): string {
  return toSearchable(s);
}
