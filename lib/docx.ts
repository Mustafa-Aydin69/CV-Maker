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
import type { CVData } from "./types";
import { dateRange, fmtMonth } from "./format";

// ── Yardımcılar ──────────────────────────────────────────────────────────────

function hex(color: string): string {
  return color.replace("#", "").toUpperCase();
}

/** Bölüm başlığı paragrafı */
function sectionHead(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 21,         // 10.5pt
        color: "000000",
      }),
    ],
    border: {
      bottom: { color: "BBBBBB", style: BorderStyle.SINGLE, size: 4 },
    },
    spacing: { before: 240, after: 100 },
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

export async function exportDocx(data: CVData, accentColor = "#1a1a1a"): Promise<void> {
  const accentHex = hex(accentColor);
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Ad Soyad";

  const children: Paragraph[] = [];

  // ── İsim ───────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: fullName, bold: true, size: 48, color: "000000" })],
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

  // ── Hakkımda ───────────────────────────────────────────────────────────────
  if ((data.about || "").trim()) {
    children.push(sectionHead("Hakkımda"));
    children.push(plain(data.about.trim(), { after: 80 }));
  }

  // ── Deneyim ────────────────────────────────────────────────────────────────
  if (data.experience.length) {
    children.push(sectionHead("Deneyim"));
    for (const it of data.experience) {
      const sub = [it.company, it.location].filter(Boolean).join(" · ");
      children.push(itemHead(it.role || "Pozisyon", sub ? " · " + sub : "", dateRange(it.start, it.end, it.current), accentHex));
      children.push(...bullets(it.description));
      children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
    }
  }

  // ── Eğitim ─────────────────────────────────────────────────────────────────
  if (data.education.length) {
    children.push(sectionHead("Eğitim"));
    for (const it of data.education) {
      const deg = [it.degree, it.field].filter(Boolean).join(", ");
      const sub = [deg, it.gpa ? "GPA " + it.gpa : ""].filter(Boolean).join(" · ");
      children.push(itemHead(it.school || "Okul", sub ? " · " + sub : "", dateRange(it.start, it.end, false), accentHex));
      if (it.notes) children.push(plain(it.notes));
      children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
    }
  }

  // ── Projeler ───────────────────────────────────────────────────────────────
  if (data.projects.length) {
    children.push(sectionHead("Projeler"));
    for (const it of data.projects) {
      children.push(itemHead(it.name || "Proje", it.stack ? " · " + it.stack : "", it.link || "", accentHex));
      children.push(...bullets(it.description));
      children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
    }
  }

  // ── Sertifikalar ───────────────────────────────────────────────────────────
  const certs = (data.certifications ?? []).filter((c) => c.name);
  if (certs.length) {
    children.push(sectionHead("Sertifikalar"));
    for (const it of certs) {
      children.push(itemHead(it.name, it.issuer ? " · " + it.issuer : "", fmtMonth(it.date), accentHex));
      if (it.link) children.push(plain(it.link, { size: 17, color: "777777" }));
      children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
    }
  }

  // ── Ödüller ────────────────────────────────────────────────────────────────
  const awds = (data.awards ?? []).filter((a) => a.title);
  if (awds.length) {
    children.push(sectionHead("Ödüller"));
    for (const it of awds) {
      children.push(itemHead(it.title, it.issuer ? " · " + it.issuer : "", fmtMonth(it.date), accentHex));
      if (it.note) children.push(plain(it.note));
      children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
    }
  }

  // ── Yetenekler ─────────────────────────────────────────────────────────────
  const skillCats = data.skills.filter((c) => c.items.length > 0);
  if (skillCats.length) {
    children.push(sectionHead("Yetenekler"));
    for (const c of skillCats) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name + ": ", bold: true, size: 19 }),
            new TextRun({ text: c.items.join(" · "), size: 19, color: "333333" }),
          ],
          spacing: { after: 60 },
        })
      );
    }
  }

  // ── Yabancı Diller ─────────────────────────────────────────────────────────
  const langs = (data.languages ?? []).filter(Boolean);
  if (langs.length) {
    children.push(sectionHead("Yabancı Diller"));
    children.push(plain(langs.join("  ·  ")));
  }

  // ── Hobiler ────────────────────────────────────────────────────────────────
  const hobbies = (data.hobbies ?? []).filter(Boolean);
  if (hobbies.length) {
    children.push(sectionHead("Hobiler"));
    children.push(plain(hobbies.join("  ·  ")));
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
