// lib/types.ts — Tüm CV veri tipleri

export interface LineHeightOption {
  id: string;
  label: string;
  val: string;
}

export interface Experience {
  _id: number;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}

export interface Education {
  _id: number;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  gpa: string;
  notes: string;
}

export interface Project {
  _id: number;
  name: string;
  stack: string;
  link: string;
  description: string;
}

export interface SkillCategory {
  _id: number;
  name: string;
  items: string[];
}

export interface CVData {
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string | null;
  about: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  languages: string[];
}

export interface FontOption {
  id: string;
  label: string;
  css: string;
}

export interface AccentOption {
  id: string;
  val: string;
  label: string;
}

export interface Settings {
  showPhoto: boolean;
  fontId: string;
  accentId: string;
  lineHeightId: string;
  zoom: number;
}

export interface PreviewOptions {
  showPhoto: boolean;
  font: string;
  accent: string;
  lineHeight: string;
  zoom: number;
}

export interface AtsCheck {
  ok: boolean;
  label: string;
}

export interface AtsScore {
  pct: number;
  passed: number;
  total: number;
  checks: AtsCheck[];
}
