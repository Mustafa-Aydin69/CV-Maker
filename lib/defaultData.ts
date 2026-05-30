// lib/defaultData.ts — Varsayılan içerik + font/renk seçenekleri

import type { CVData, FontOption, AccentOption, Settings } from "./types";

export const STORAGE_KEY = "cv-maker-data-v1";
export const SETTINGS_KEY = "cv-maker-settings-v1";

export const DEFAULT_DATA: CVData = {
  firstName: "Ayşe",
  lastName: "Demir",
  title: "Senior Frontend Developer",
  phone: "+90 532 123 45 67",
  email: "ayse.demir@ornek.com",
  address: "İstanbul, Türkiye",
  linkedin: "linkedin.com/in/aysedemir",
  github: "github.com/aysedemir",
  website: "",
  photo: null,
  about:
    "6+ yıl deneyimli, ölçeklenebilir ve erişilebilir web uygulamaları geliştiren bir frontend mühendisiyim. React, TypeScript ve modern web teknolojilerinde derin uzmanlığa sahibim. Kullanıcı odaklı tasarım, performans optimizasyonu ve ekip mentörlüğü konularında güçlü bir geçmişe sahibim.",
  experience: [
    {
      _id: 1,
      role: "Senior Frontend Developer",
      company: "Trendyol",
      location: "İstanbul (Hibrit)",
      start: "2022-03",
      end: "",
      current: true,
      description:
        "React/TypeScript ile e-ticaret platformunun ürün sayfasını yeniden yazdım; LCP süresini 3.8s'den 1.4s'e düşürdüm\nMicrofrontend mimarisine geçişi 5 kişilik ekiple yönettim, deploy süresini %60 kısalttım\nDesign system'in 40+ componentini Storybook ile dokümante ettim ve 12 ekibe yaygınlaştırdım\n8 junior geliştiriciye düzenli mentörlük yaptım",
    },
    {
      _id: 2,
      role: "Frontend Developer",
      company: "Getir",
      location: "İstanbul",
      start: "2020-01",
      end: "2022-02",
      current: false,
      description:
        "Sürücü uygulamasının web panelini sıfırdan geliştirdim, 3000+ kurye tarafından günlük kullanılıyor\nA/B testleri ile checkout dönüşüm oranını %18 artırdım\nNext.js ile SSR mimarisine geçişi yönettim",
    },
  ],
  education: [
    {
      _id: 11,
      school: "Boğaziçi Üniversitesi",
      degree: "Lisans",
      field: "Bilgisayar Mühendisliği",
      start: "2015-09",
      end: "2019-06",
      gpa: "3.42 / 4.00",
      notes: "Onur öğrencisi · Bitirme: Doğal dil işleme ile sahte yorum tespiti",
    },
  ],
  projects: [
    {
      _id: 21,
      name: "OpenForm",
      stack: "React, TypeScript, Supabase",
      link: "github.com/aysedemir/openform",
      description:
        "Açık kaynak form builder; 1.2k GitHub yıldızı\nDrag-drop editör ve gerçek zamanlı işbirliği özellikleri",
    },
  ],
  skills: [
    { _id: 31, name: "Diller", items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML/CSS"] },
    { _id: 32, name: "Frameworks & Kütüphaneler", items: ["React", "Next.js", "Vue", "Redux", "TailwindCSS", "Node.js"] },
    { _id: 33, name: "Araçlar", items: ["Git", "Docker", "Figma", "Jest", "Cypress", "Storybook"] },
    { _id: 34, name: "Yabancı Diller", items: ["İngilizce (C1)", "Almanca (A2)"] },
  ],
};

export const EMPTY_DATA: CVData = {
  ...DEFAULT_DATA,
  firstName: "",
  lastName: "",
  title: "",
  phone: "",
  email: "",
  address: "",
  linkedin: "",
  github: "",
  website: "",
  photo: null,
  about: "",
  experience: [],
  education: [],
  projects: [],
  skills: [{ _id: 1, name: "Diller", items: [] }],
};

export const FONT_OPTIONS: FontOption[] = [
  { id: "helvetica", label: "Helvetica (ATS önerilen)", css: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: "arial", label: "Arial", css: 'Arial, "Helvetica Neue", sans-serif' },
  { id: "calibri", label: "Calibri", css: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' },
  { id: "georgia", label: "Georgia (serif)", css: 'Georgia, "Times New Roman", Times, serif' },
  { id: "times", label: "Times New Roman", css: '"Times New Roman", Times, serif' },
];

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: "mono", val: "#1a1a1a", label: "Klasik" },
  { id: "navy", val: "#1d3f87", label: "Lacivert" },
  { id: "forest", val: "#1f6f43", label: "Orman" },
  { id: "wine", val: "#7a1f3c", label: "Şarap" },
];

export const DEFAULT_SETTINGS: Settings = {
  showPhoto: true,
  fontId: "helvetica",
  accentId: "mono",
  zoom: 0.78,
};
