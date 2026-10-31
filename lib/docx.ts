// lib/docx.ts — DOCX (Word) dışa aktarma
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  UnderlineType,
} from "docx";
import type { CVData, TemplateId } from "./types";
import { dateRange, fmtMonth } from "./format";
import { sectionTitle, placeholder, type Lang } from "./i18n";
import { TEMPLATE_STYLES, type TemplateStyle } from "./templates";

// ── Yardımcılar ──────────────────────────────────────────────────────────────

function hex(color: string): string {
  return color.replace("#", "").toUpperCase();
}

/** Bölüm başlığı paragrafı */
function sectionHead(title: string, ts: TemplateStyle, accentHex: string): Paragraph {
  const color = ts.headingColor === "accent" ? accentHex : ts.headingColor === "gray" ? "777777" : "000000";
  return new Paragraph({
    children: [
      new TextRun({
        text: ts.headingUppercase ? title.toUpperCase() : title,
        bold: true,
        size: Math.round(ts.headingSizePt * 2),   // docx yarım punto ister
        color,
      }),
    ],
    border:
      ts.heading === "underline" ? { bottom: { color: "BBBBBB", style: BorderStyle.SINGLE, size: 4 } } :
      ts.heading === "bar"       ? { left:   { color: accentHex, style: BorderStyle.SINGLE, size: 18, space: 6 } } :
      undefined,
    spacing: { before: Math.round(240 * ts.gap), after: Math.round(100 * ts.gap) },
  });
}

/** Madde başı: kalın başlık + italik alt + sağa hizalı tarih */
function itemHead(
  title: string,
  sub: string,
  date: string,
  accentHex: string
): Paragraph {
  const runs: TextRun[] = [
    new TextRun({ text: title, bold: true, size: 20 }),
    ...(sub ? [new TextRun({ text: sub, italics: true, size: 19, color: "555555" })] : []),
    ...(date
      ? [
          new TextRun({ text: "\t", size: 19 }),
          new TextRun({ text: date, size: 18, color: "777777" }),
        ]
      : []),
  ];
  return new Paragraph({
    children: runs,
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 60 },
  });
}

/** Madde satırı (bullet nokta) */
function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 19, color: "333333" })],
    bullet: { level: 0 },
    spacing: { after: 50 },
  });
}

/** Açıklama metnini satırlara böl → bullet[] */
function bullets(text: string): Paragraph[] {
  if (!text) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map(bullet);
}

/** Yalın metin paragrafı */
function plain(text: string, opts?: { size?: number; color?: string; after?: number }): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: opts?.size ?? 19,
        color: opts?.color ?? "333333",
      }),
    ],
    spacing: { after: opts?.after ?? 60 },
  });
}

// ── Ana dışa aktarma ─────────────────────────────────────────────────────────

const DEFAULT_SECTION_ORDER_DOCX = [
  "about","experience","education","projects","certifications","awards","skills","languages","hobbies",
];

export async function exportDocx(
  data: CVData,
  accentColor = "#1a1a1a",
  sectionOrder: string[] = DEFAULT_SECTION_ORDER_DOCX,
  hiddenSections: string[] = [],
  language: Lang = "tr",
  template: TemplateId = "classic",
): Promise<void> {
  const accentHex = hex(accentColor);
  const ts = TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.classic;
  const head = (id: string) => sectionHead(sectionTitle(id, language), ts, accentHex);
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || placeholder("fullName", language);

  const children: Paragraph[] = [];

  // ── İsim ───────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: fullName, bold: ts.nameBold, size: 48, color: ts.nameAccent ? accentHex : "000000" })],
      spacing: { after: 80 },
    })
  );

  // ── Ünvan ──────────────────────────────────────────────────────────────────
  if (data.title) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: data.title, bold: true, size: 23, color: accentHex })],
        spacing: { after: 120 },
      })
    );
  }

  // ── İletişim ───────────────────────────────────────────────────────────────
  const contactParts = [
    data.phone,
    data.email,
    data.address,
    data.linkedin,
    data.github,
    data.website,
  ].filter(Boolean);
  if (contactParts.length) {
    children.push(plain(contactParts.join("  |  "), { size: 17, color: "555555", after: 200 }));
  }

  // ── Bölüm render fonksiyonları ───────────────────────────────────────────
  const sectionRenderers: Record<string, () => void> = {
    about: () => {
      if (!(data.about || "").trim()) return;
      children.push(head("about"));
      children.push(plain(data.about.trim(), { after: 80 }));
    },
    experience: () => {
      if (!data.experience.length) return;
      children.push(head("experience"));
      for (const it of data.experience) {
        const sub = [it.company, it.location].filter(Boolean).join(" · ");
        children.push(itemHead(it.role || placeholder("position", language), sub ? " · " + sub : "", dateRange(it.start, it.end, it.current, language), accentHex));
        children.push(...bullets(it.description));
        children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    },
    education: () => {
      if (!data.education.length) return;
      children.push(head("education"));
      for (const it of data.education) {
        const deg = [it.degree, it.field].filter(Boolean).join(", ");
        const sub = [deg, it.gpa ? "GPA " + it.gpa : ""].filter(Boolean).join(" · ");
        children.push(itemHead(it.school || placeholder("school", language), sub ? " · " + sub : "", dateRange(it.start, it.end, false, language), accentHex));
        if (it.notes) children.push(plain(it.notes));
        children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    },
    projects: () => {
      if (!data.projects.length) return;
      children.push(head("projects"));
      for (const it of data.projects) {
        children.push(itemHead(it.name || placeholder("project", language), it.stack ? " · " + it.stack : "", it.link || "", accentHex));
        children.push(...bullets(it.description));
        children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    },
    certifications: () => {
      const certs = (data.certifications ?? []).filter((c) => c.name);
      if (!certs.length) return;
      children.push(head("certifications"));
      for (const it of certs) {
        children.push(itemHead(it.name, it.issuer ? " · " + it.issuer : "", fmtMonth(it.date, language), accentHex));
        if (it.link) children.push(plain(it.link, { size: 17, color: "777777" }));
        children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
      }
    },
    awards: () => {
      const awds = (data.awards ?? []).filter((a) => a.title);
      if (!awds.length) return;
      children.push(head("awards"));
      for (const it of awds) {
        children.push(itemHead(it.title, it.issuer ? " · " + it.issuer : "", fmtMonth(it.date, language), accentHex));
        if (it.note) children.push(plain(it.note));
        children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
      }
    },
    skills: () => {
      const skillCats = data.skills.filter((c) => c.items.length > 0);
      if (!skillCats.length) return;
      children.push(head("skills"));
      for (const c of skillCats) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: c.name + ": ", bold: true, size: 19 }),
            new TextRun({ text: c.items.join(" · "), size: 19, color: "333333" }),
          ],
          spacing: { after: 60 },
        }));
      }
    },
    languages: () => {
      const langs = (data.languages ?? []).filter(Boolean);
      if (!langs.length) return;
      children.push(head("languages"));
      children.push(plain(langs.join("  ·  ")));
    },
    hobbies: () => {
      const hobbies = (data.hobbies ?? []).filter(Boolean);
      if (!hobbies.length) return;
      children.push(head("hobbies"));
      children.push(plain(hobbies.join("  ·  ")));
    },
    volunteer: () => {
      const vols = (data.volunteers ?? []).filter((v) => v.role);
      if (!vols.length) return;
      children.push(head("volunteer"));
      for (const it of vols) {
        const sub = [it.organization, it.location].filter(Boolean).join(" · ");
        children.push(itemHead(it.role, sub ? " · " + sub : "", dateRange(it.start, it.end, it.current, language), accentHex));
        children.push(...bullets(it.description));
        children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    },
    activities: () => {
      const acts = (data.activities ?? []).filter((a) => a.role || a.organization);
      if (!acts.length) return;
      children.push(head("activities"));
      for (const it of acts) {
        children.push(itemHead(it.role || placeholder("actRole", language), it.organization ? " · " + it.organization : "", dateRange(it.start, it.end, it.current, language), accentHex));
        children.push(...bullets(it.description));
        children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    },
    references: () => {
      const refs = (data.references ?? []).filter((r) => r.name);
      if (!refs.length) return;
      children.push(head("references"));
      for (const it of refs) {
        const sub = [it.title, it.company].filter(Boolean).join(", ");
        const contact = [it.email, it.phone].filter(Boolean).join(" · ");
        children.push(itemHead(it.name, sub ? " · " + sub : "", contact, accentHex));
        if (it.note) children.push(plain(it.note, { size: 17, color: "777777" }));
        children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
      }
    },
  };

  const visible = sectionOrder.filter((id) => !hiddenSections.includes(id));
  for (const id of visible) sectionRenderers[id]?.();

  // Özel bölümler
  for (const cs of (data.customSections ?? []).filter((c) => c.title)) {
    children.push(sectionHead(cs.title, ts, accentHex));
    children.push(...bullets(cs.content));
    children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
  }

  // ── Belge ──────────────────────────────────────────────────────────────────
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // 20mm ≈ 1134 twips
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const name = [data.firstName, data.lastName].filter(Boolean).join("-") || "CV";
  a.href = url;
  a.download = `${name}-CV.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
