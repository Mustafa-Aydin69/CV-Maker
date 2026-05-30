// lib/linkedinImport.ts — LinkedIn CSV arşivinden CVData çıkarma

import type { CVData } from "./types";
import { DEFAULT_DATA } from "./defaultData";

// ── CSV ayrıştırıcı ───────────────────────────────────────────────────────────

function parseLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === "," && !inQ) {
      result.push(cur.trim()); cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const cleaned = text.replace(/^﻿/, "").replace(/\r/g, "");
  const lines = cleaned.split("\n");
  if (lines.length < 2) return [];
  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h.trim()] = (vals[j] ?? "").trim(); });
    rows.push(row);
  }
  return rows;
}

// ── Tarih dönüştürücü ─────────────────────────────────────────────────────────

const LI_MONTHS: Record<string, number> = {
  Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
  Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12,
};

function liDate(s: string): string {
  if (!s || /present/i.test(s)) return "";
  const m3 = s.match(/^(\w{3})\s+(\d{4})$/);
  if (m3) {
    const mo = LI_MONTHS[m3[1]];
    return mo ? `${m3[2]}-${String(mo).padStart(2, "0")}` : `${m3[2]}-01`;
  }
  const yr = s.match(/^(\d{4})$/);
  if (yr) return `${yr[1]}-01`;
  return "";
}

// ── Dil seviyesi ─────────────────────────────────────────────────────────────

const PROF: Record<string, string> = {
  ELEMENTARY:          "A2",
  LIMITED_WORKING:     "B1",
  PROFESSIONAL_WORKING:"B2",
  FULL_PROFESSIONAL:   "C1",
  NATIVE_OR_BILINGUAL: "Ana dil",
};

// ── Dosya türü tespiti ───────────────────────────────────────────────────────

type LiFileType = "profile" | "positions" | "education" | "skills" | "languages" | "unknown";

function detectType(headers: string[]): LiFileType {
  const lh = headers.map((h) => h.toLowerCase());
  if (lh.some((h) => h.includes("headline") || h === "first name")) return "profile";
  if (lh.some((h) => h.includes("company name")) && lh.some((h) => h === "title")) return "positions";
  if (lh.some((h) => h.includes("school name"))) return "education";
  if (lh.some((h) => h === "proficiency")) return "languages";
  if (lh.some((h) => h === "name") && lh.length <= 4) return "skills";
  return "unknown";
}

// ── Dosya işleyiciler ────────────────────────────────────────────────────────

function applyProfile(rows: Record<string, string>[], draft: Partial<CVData>) {
  const r = rows[0];
  if (!r) return;
  draft.firstName = r["First Name"]  || r["first name"]  || draft.firstName;
  draft.lastName  = r["Last Name"]   || r["last name"]   || draft.lastName;
  draft.title     = r["Headline"]    || r["headline"]    || draft.title;
  draft.about     = r["Summary"]     || r["summary"]     || draft.about;
  draft.address   = r["Geo Location"]|| r["geo location"]|| draft.address;
}

function applyPositions(rows: Record<string, string>[], draft: Partial<CVData>) {
  const experience: CVData["experience"] = rows.map((r, i) => ({
    _id: Date.now() + i,
    role:        r["Title"]        || "",
    company:     r["Company Name"] || "",
    location:    r["Location"]     || "",
    start:       liDate(r["Started On"]  || ""),
    end:         liDate(r["Finished On"] || ""),
    current:     /present/i.test(r["Finished On"] || ""),
    description: r["Description"]  || "",
  }));
  draft.experience = experience;
}

function applyEducation(rows: Record<string, string>[], draft: Partial<CVData>) {
  const education: CVData["education"] = rows.map((r, i) => ({
    _id:    Date.now() + i,
    school: r["School Name"] || "",
    degree: r["Degree Name"] || "",
    field:  r["Field Of Study"] || r["Activities"] || "",
    start:  liDate(r["Start Date"] || ""),
    end:    liDate(r["End Date"]   || ""),
    gpa:    "",
    notes:  r["Notes"] || "",
  }));
  draft.education = education;
}

function applySkills(rows: Record<string, string>[], draft: Partial<CVData>) {
  const items = rows.map((r) => r["Name"] || "").filter(Boolean);
  if (!items.length) return;
  draft.skills = [{ _id: Date.now(), name: "Yetenekler", items }];
}

function applyLanguages(rows: Record<string, string>[], draft: Partial<CVData>) {
  const languages = rows.map((r) => {
    const name  = r["Name"]        || "";
    const level = PROF[r["Proficiency"] || ""] || r["Proficiency"] || "";
    return level ? `${name} (${level})` : name;
  }).filter(Boolean);
  draft.languages = languages;
}

// ── Ana export ───────────────────────────────────────────────────────────────

export interface ImportResult {
  data: Partial<CVData>;
  imported: LiFileType[];
  skipped: string[];
}

export async function importLinkedInFiles(files: FileList): Promise<ImportResult> {
  const draft: Partial<CVData> = {};
  const imported: LiFileType[] = [];
  const skipped: string[] = [];

  for (const file of Array.from(files)) {
    const text = await file.text();
    const rows = parseCSV(text);
    if (!rows.length) { skipped.push(file.name); continue; }

    const type = detectType(Object.keys(rows[0]));
    switch (type) {
      case "profile":   applyProfile(rows, draft);   break;
      case "positions": applyPositions(rows, draft);  break;
      case "education": applyEducation(rows, draft);  break;
      case "skills":    applySkills(rows, draft);     break;
      case "languages": applyLanguages(rows, draft);  break;
      default:          skipped.push(file.name);      continue;
    }
    imported.push(type);
  }

  return { data: draft, imported, skipped };
}

export function mergeLinkedIn(current: CVData, imported: Partial<CVData>): CVData {
  return { ...DEFAULT_DATA, ...current, ...imported };
}
