// lib/i18n.ts — CV çıktısı (önizleme, PDF, Word) için TR/EN metin sözlüğü.
// Kullanıcının kendi girdiği içerik (deneyim açıklaması vb.) çevrilmez;
// yalnızca CV şablonundaki sabit başlık ve etiketler buradan okunur.

export type Lang = "tr" | "en";

type Dict = Record<Lang, string>;

export const MONTHS: Record<Lang, string[]> = {
  tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const PRESENT: Dict = { tr: "Halen", en: "Present" };

export const SECTION_TITLES: Record<string, Dict> = {
  about:          { tr: "Hakkımda",       en: "About" },
  experience:     { tr: "Deneyim",        en: "Experience" },
  education:      { tr: "Eğitim",         en: "Education" },
  projects:       { tr: "Projeler",       en: "Projects" },
  certifications: { tr: "Sertifikalar",   en: "Certifications" },
  awards:         { tr: "Ödüller",        en: "Awards" },
  skills:         { tr: "Yetenekler",     en: "Skills" },
  languages:      { tr: "Yabancı Diller", en: "Languages" },
  hobbies:        { tr: "Hobiler",        en: "Hobbies" },
  volunteer:      { tr: "Gönüllülük",     en: "Volunteering" },
  references:     { tr: "Referanslar",    en: "References" },
  contact:        { tr: "İletişim",       en: "Contact" },
};

export const PLACEHOLDERS: Record<string, Dict> = {
  fullName: { tr: "Ad Soyad",    en: "Full Name" },
  position: { tr: "Pozisyon",    en: "Position" },
  school:   { tr: "Okul",        en: "School" },
  project:  { tr: "Proje",       en: "Project" },
  cert:     { tr: "Sertifika",   en: "Certificate" },
  award:    { tr: "Ödül",        en: "Award" },
  volRole:  { tr: "Gönüllü Rol", en: "Volunteer Role" },
  reference:{ tr: "Referans",    en: "Reference" },
};

export const CONTACT_LABELS: Record<string, Dict> = {
  address:  { tr: "Adres",    en: "Address" },
  phone:    { tr: "Tel",      en: "Phone" },
  email:    { tr: "E-posta",  en: "Email" },
  linkedin: { tr: "LinkedIn", en: "LinkedIn" },
  github:   { tr: "GitHub",   en: "GitHub" },
  website:  { tr: "Web",      en: "Website" },
};

export function sectionTitle(id: string, lang: Lang): string {
  return SECTION_TITLES[id]?.[lang] ?? id;
}

export function placeholder(id: keyof typeof PLACEHOLDERS, lang: Lang): string {
  return PLACEHOLDERS[id][lang];
}

export function contactLabel(id: keyof typeof CONTACT_LABELS, lang: Lang): string {
  return CONTACT_LABELS[id][lang];
}
