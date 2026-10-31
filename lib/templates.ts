// lib/templates.ts — Şablonların görünüm parametreleri.
// Önizleme bu görünümü CSS sınıflarıyla (cv--modern vb.) çizer; PDF ve Word ise
// CSS okuyamadığı için aynı kararları buradaki tablodan alır. Bir şablonu
// değiştirirken globals.css'teki karşılığını da güncellemek gerekir.

import type { TemplateId } from "./types";

export interface TemplateStyle {
  nameAccent: boolean;                      // ad soyad aksan renginde mi
  nameBold: boolean;
  headerRule: "accent" | "thin" | "none";   // başlık bloğunun altındaki çizgi
  heading: "underline" | "bar" | "plain";   // bölüm başlığı süslemesi
  headingColor: "black" | "accent" | "gray";
  headingUppercase: boolean;
  headingSizePt: number;
  gap: number;                              // dikey boşluk çarpanı
}

const CLASSIC: TemplateStyle = {
  nameAccent: false, nameBold: true, headerRule: "accent",
  heading: "underline", headingColor: "black", headingUppercase: true, headingSizePt: 10.5, gap: 1,
};

export const TEMPLATE_STYLES: Record<TemplateId, TemplateStyle> = {
  classic: CLASSIC,
  // PDF/Word iki sütunu çizemez; Şeritli şablon dışa aktarımda klasik görünür.
  sidebar: CLASSIC,
  modern: {
    nameAccent: true, nameBold: true, headerRule: "none",
    heading: "bar", headingColor: "accent", headingUppercase: false, headingSizePt: 12, gap: 1.1,
  },
  minimal: {
    nameAccent: false, nameBold: false, headerRule: "thin",
    heading: "plain", headingColor: "gray", headingUppercase: true, headingSizePt: 9.5, gap: 1.25,
  },
  compact: {
    nameAccent: false, nameBold: true, headerRule: "accent",
    heading: "underline", headingColor: "black", headingUppercase: true, headingSizePt: 9.5, gap: 0.6,
  },
};

export const TEMPLATE_OPTIONS: Array<{ id: TemplateId; label: string; hint: string }> = [
  { id: "classic", label: "Klasik",  hint: "Dengeli, her başvuruya uygun" },
  { id: "modern",  label: "Modern",  hint: "Renkli ad ve şeritli başlıklar" },
  { id: "minimal", label: "Minimal", hint: "Sade, bol boşluklu" },
  { id: "compact", label: "Kompakt", hint: "Dolu CV'yi tek sayfaya sığdırır" },
  { id: "sidebar", label: "Şeritli", hint: "İki sütun (PDF/Word klasik iner)" },
];
