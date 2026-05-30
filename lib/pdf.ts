// lib/pdf.ts — ATS uyumlu, metin tabanlı PDF üretimi (jsPDF) + görüntü yedeği.
// Türkçe karakter desteği için Roboto fontu gömülür.

import { jsPDF } from "jspdf";
import type { CVData } from "./types";

// ── Font yükleme ────────────────────────────────────────────────────
const FONT_SOURCES: Array<(style: string, weight: string) => string> = [
  (style, weight) =>
    `https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.13/files/roboto-latin-ext-${weight}-${style}.ttf`,
  (style, weight) =>
    `https://unpkg.com/@fontsource/roboto@5.0.13/files/roboto-latin-ext-${weight}-${style}.ttf`,
  (style, weight) =>
    `https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.13/files/roboto-latin-${weight}-${style}.ttf`,
];

interface FontBundle {
  normal: string;
  bold: string;
  italic: string;
}

let _fontCache: FontBundle | null = null;

async function fetchFontB64(style: string, weight: string): Promise<string> {
  let lastErr: unknown;
  for (const build of FONT_SOURCES) {
    const url = build(style, weight);
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) {
        lastErr = new Error(`${r.status} ${url}`);
        continue;
      }
      const buf = await r.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
      }
      return btoa(bin);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Font yüklenemedi");
}

async function loadFonts(): Promise<FontBundle> {
  if (_fontCache) return _fontCache;
  const [normal, bold, italic] = await Promise.all([
    fetchFontB64("normal", "400"),
    fetchFontB64("normal", "700"),
    fetchFontB64("italic", "400"),
  ]);
  _fontCache = { normal, bold, italic };
  return _fontCache;
}

function registerFonts(doc: jsPDF, fonts: FontBundle) {
  doc.addFileToVFS("Roboto-Regular.ttf", fonts.normal);
  doc.addFileToVFS("Roboto-Bold.ttf", fonts.bold);
  doc.addFileToVFS("Roboto-Italic.ttf", fonts.italic);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  doc.addFont("Roboto-Italic.ttf", "Roboto", "italic");
}

function hexToRgb(h: string): [number, number, number] {
  const m = h.replace("#", "");
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}

// ── Tarih biçimi ────────────────────────────────────────────────────
const TR_MONTHS_PDF = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
function fmtM(ym: string): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const mi = parseInt(m, 10) - 1;
  if (isNaN(mi) || mi < 0 || mi > 11) return ym;
  return `${TR_MONTHS_PDF[mi]} ${y}`;
}
function dr(start: string, end: string, current: boolean): string {
  const s = fmtM(start);
  const e = current ? "Halen" : fmtM(end);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

// ── Sayfa ölçüleri (mm) ─────────────────────────────────────────────
const PAGE_W = 210;
const PAGE_H = 297;
const M_L = 18;
const M_R = 18;
const M_T = 18;
const M_B = 18;
const CONTENT_W = PAGE_W - M_L - M_R;
const BOTTOM = PAGE_H - M_B;

export interface ExportOptions {
  showPhoto?: boolean;
  accent?: string;
}

function safeName(s: string): string {
  return s.replace(/[^a-zA-Z0-9-_İıŞşĞğÇçÖöÜü ]/g, "").replace(/\s+/g, "-");
}

export async function exportPdf(data: CVData, opts: ExportOptions = {}): Promise<void> {
  const { showPhoto = true, accent = "#1a1a1a" } = opts;

  let fonts: FontBundle;
  try {
    fonts = await loadFonts();
  } catch (err) {
    console.warn("[CV Maker] Roboto yüklenemedi, yedek (görüntü) moda geçiliyor:", err);
    return exportPdfFromDom(data);
  }

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  registerFonts(doc, fonts);
  doc.setFont("Roboto", "normal");

  const [aR, aG, aB] = hexToRgb(accent);
  const state = { y: M_T };

  const setF = (size: number, weight: "normal" | "bold" | "italic" = "normal") => {
    doc.setFont("Roboto", weight);
    doc.setFontSize(size);
  };
  const setColor = (r: number, g: number, b: number) => doc.setTextColor(r, g, b);
  const ensureSpace = (need: number) => {
    if (state.y + need > BOTTOM) {
      doc.addPage();
      state.y = M_T;
    }
  };
  const lh = (sizePt: number, mult = 1.35) => sizePt * 0.3528 * mult;

  const drawWrapped = (text: string, x: number, maxW: number, sizePt: number, weight: "normal" | "bold" | "italic" = "normal") => {
    setF(sizePt, weight);
    const lines = doc.splitTextToSize(text, maxW);
    const lineH = lh(sizePt, 1.35);
    for (const line of lines) {
      ensureSpace(lineH);
      doc.text(line, x, state.y + sizePt * 0.3528 * 0.8);
      state.y += lineH;
    }
  };

  const drawBullets = (text: string, x: number, maxW: number) => {
    if (!text) return;
    const items = text.split("\n").map((l) => l.trim()).filter(Boolean);
    setF(9.5);
    setColor(60, 60, 60);
    const sizePt = 9.5;
    const lineH = lh(sizePt, 1.4);
    const bulletX = x + 1.5;
    const textX = x + 4.5;
    const textW = maxW - 4.5;
    for (const it of items) {
      const lines = doc.splitTextToSize(it, textW);
      lines.forEach((line: string, i: number) => {
        ensureSpace(lineH);
        if (i === 0) {
          doc.setTextColor(120, 120, 120);
          doc.text("•", bulletX, state.y + sizePt * 0.3528 * 0.8);
          doc.setTextColor(60, 60, 60);
        }
        doc.text(line, textX, state.y + sizePt * 0.3528 * 0.8);
        state.y += lineH;
      });
    }
  };

  // Yükseklik tahmincileri — bir maddenin tamamı çizilmeden önce yer ayrılır
  const predictBullets = (text: string): number => {
    if (!text) return 0;
    const items = text.split("\n").map((l) => l.trim()).filter(Boolean);
    setF(9.5);
    const lineH = lh(9.5, 1.4);
    let h = 0;
    for (const it of items) h += doc.splitTextToSize(it, CONTENT_W - 4.5).length * lineH;
    return h;
  };
  const predictWrapped = (text: string, sizePt = 9.5): number => {
    if (!text) return 0;
    setF(sizePt);
    return doc.splitTextToSize(text, CONTENT_W).length * lh(sizePt, 1.35);
  };
  const predictExp = (it: CVData["experience"][number]) => 4.6 + predictBullets(it.description) + 1.5;
  const predictEdu = (it: CVData["education"][number]) => 4.6 + predictWrapped(it.notes) + 1.5;
  const predictProj = (it: CVData["projects"][number]) => 4.6 + predictBullets(it.description) + 1.5;
  const SEC_HEADER_H = 2 + 4.2 + 3.2;

  // ── HEADER ────────────────────────────────────────────────────────
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Ad Soyad";

  let headerRightLimit = PAGE_W - M_R;
  let photoH = 0;
  const hasPhoto = showPhoto && !!data.photo;
  if (hasPhoto && data.photo) {
    const photoW = 24;
    photoH = 30;
    try {
      doc.addImage(data.photo, "PNG", PAGE_W - M_R - photoW, M_T, photoW, photoH);
    } catch {
      try {
        doc.addImage(data.photo, "JPEG", PAGE_W - M_R - photoW, M_T, photoW, photoH);
      } catch {
        /* ignore */
      }
    }
    headerRightLimit = PAGE_W - M_R - photoW - 4;
  }

  setF(22, "bold");
  setColor(0, 0, 0);
  doc.text(fullName, M_L, M_T + 6.5);
  let nameY = M_T + 6.5;
  if (data.title) {
    setF(11, "bold");
    setColor(aR, aG, aB);
    doc.text(data.title, M_L, nameY + 5.5);
    nameY += 5.5;
  }

  const contacts = [
    data.address && { label: "Adres", val: data.address },
    data.phone && { label: "Tel", val: data.phone },
    data.email && { label: "E-posta", val: data.email },
    data.linkedin && { label: "LinkedIn", val: data.linkedin },
    data.github && { label: "GitHub", val: data.github },
    data.website && { label: "Web", val: data.website },
  ].filter(Boolean) as Array<{ label: string; val: string }>;

  setF(9, "normal");
  let cy = M_T + 4;
  for (const c of contacts) {
    setColor(120, 120, 120);
    const labelW = doc.getTextWidth(c.label + ": ");
    setColor(40, 40, 40);
    const valW = doc.getTextWidth(c.val);
    const startX = headerRightLimit - (labelW + valW);
    setColor(120, 120, 120);
    doc.text(c.label + ":", startX, cy);
    setColor(40, 40, 40);
    doc.text(c.val, startX + labelW, cy);
    cy += 4.2;
  }

  state.y = Math.max(nameY + 4, M_T + (hasPhoto ? photoH : 0), cy);
  doc.setDrawColor(aR, aG, aB);
  doc.setLineWidth(0.6);
  doc.line(M_L, state.y, PAGE_W - M_R, state.y);
  state.y += 5;

  const section = (title: string, followH = 0) => {
    ensureSpace(SEC_HEADER_H + followH);
    state.y += 2;
    setF(10.5, "bold");
    setColor(0, 0, 0);
    doc.text(title.toUpperCase(), M_L, state.y + 3);
    state.y += 4.2;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    doc.line(M_L, state.y, PAGE_W - M_R, state.y);
    state.y += 3.2;
  };

  const drawItemHead = (title: string, sub: string, meta: string, metaItalic = false) => {
    setF(10.5, "bold");
    setColor(15, 15, 15);
    const titleW = doc.getTextWidth(title);
    doc.text(title, M_L, state.y + 3);
    if (sub) {
      setF(9.5, "italic");
      setColor(60, 60, 60);
      doc.text(sub, M_L + titleW, state.y + 3);
    }
    if (meta) {
      setF(9, metaItalic ? "italic" : "normal");
      setColor(90, 90, 90);
      const dw = doc.getTextWidth(meta);
      doc.text(meta, PAGE_W - M_R - dw, state.y + 3);
    }
    state.y += 4.6;
  };

  // ── HAKKIMDA ──────────────────────────────────────────────────────
  if ((data.about || "").trim()) {
    section("Hakkımda", Math.min(predictWrapped(data.about.trim()), 30));
    setColor(50, 50, 50);
    drawWrapped(data.about.trim(), M_L, CONTENT_W, 9.5, "normal");
    state.y += 1;
  }

  // ── DENEYİM ───────────────────────────────────────────────────────
  if (data.experience.length) {
    section("Deneyim", predictExp(data.experience[0]));
    for (const it of data.experience) {
      ensureSpace(predictExp(it));
      const subParts: string[] = [];
      if (it.company) subParts.push(it.company);
      if (it.location) subParts.push(it.location);
      drawItemHead(
        it.role || "Pozisyon",
        subParts.length ? " · " + subParts.join(" · ") : "",
        dr(it.start, it.end, it.current)
      );
      drawBullets(it.description, M_L, CONTENT_W);
      state.y += 1.5;
    }
  }

  // ── EĞİTİM ────────────────────────────────────────────────────────
  if (data.education.length) {
    section("Eğitim", predictEdu(data.education[0]));
    for (const it of data.education) {
      ensureSpace(predictEdu(it));
      const degLine = [it.degree, it.field].filter(Boolean).join(", ");
      const sub = (degLine ? " · " + degLine : "") + (it.gpa ? " · GPA " + it.gpa : "");
      drawItemHead(it.school || "Okul", sub, dr(it.start, it.end, false));
      if (it.notes) {
        setColor(60, 60, 60);
        drawWrapped(it.notes, M_L, CONTENT_W, 9.5, "normal");
      }
      state.y += 1.5;
    }
  }

  // ── PROJELER ──────────────────────────────────────────────────────
  if (data.projects.length) {
    section("Projeler", predictProj(data.projects[0]));
    for (const it of data.projects) {
      ensureSpace(predictProj(it));
      drawItemHead(it.name || "Proje", it.stack ? " · " + it.stack : "", it.link || "", true);
      drawBullets(it.description, M_L, CONTENT_W);
      state.y += 1.5;
    }
  }

  // ── SERTİFİKALAR ──────────────────────────────────────────────────
  const certs = (data.certifications ?? []).filter((c) => c.name);
  if (certs.length) {
    const predictCert = () => 4.6 + 1.5;
    section("Sertifikalar", predictCert());
    for (const it of certs) {
      ensureSpace(predictCert());
      const date = it.date ? (() => {
        const [y, m] = it.date.split("-");
        const mi = parseInt(m, 10) - 1;
        const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
        return isNaN(mi) || mi < 0 || mi > 11 ? it.date : `${months[mi]} ${y}`;
      })() : "";
      drawItemHead(it.name || "Sertifika", it.issuer ? " · " + it.issuer : "", date);
      if (it.link) {
        setF(9, "italic");
        setColor(100, 100, 100);
        doc.text(it.link, M_L, state.y + 2.5);
        state.y += 3.5;
      }
      state.y += 1;
    }
  }

  // ── ÖDÜLLER ───────────────────────────────────────────────────────
  const awds = (data.awards ?? []).filter((a) => a.title);
  if (awds.length) {
    const predictAward = (a: typeof awds[number]) => 4.6 + (a.note ? predictWrapped(a.note) : 0) + 1.5;
    section("Ödüller", predictAward(awds[0]));
    for (const it of awds) {
      ensureSpace(predictAward(it));
      const date = it.date ? (() => {
        const [y, m] = it.date.split("-");
        const mi = parseInt(m, 10) - 1;
        const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
        return isNaN(mi) || mi < 0 || mi > 11 ? it.date : `${months[mi]} ${y}`;
      })() : "";
      drawItemHead(it.title || "Ödül", it.issuer ? " · " + it.issuer : "", date);
      if (it.note) {
        setColor(60, 60, 60);
        drawWrapped(it.note, M_L, CONTENT_W, 9.5);
      }
      state.y += 1.5;
    }
  }

  // ── YETENEKLER ────────────────────────────────────────────────────
  const skillCats = data.skills.filter((c) => c.items.length > 0);
  if (skillCats.length) {
    section("Yetenekler");
    const catColW = 38;
    for (const c of skillCats) {
      const items = c.items.join(" · ");
      setF(9.5, "bold");
      setColor(15, 15, 15);
      const catLabel = c.name + ":";
      const catW = Math.min(catColW, doc.getTextWidth(catLabel) + 2);
      doc.text(catLabel, M_L, state.y + 3);
      setF(9.5, "normal");
      setColor(40, 40, 40);
      const lines = doc.splitTextToSize(items, CONTENT_W - catW);
      const lineH = lh(9.5, 1.35);
      lines.forEach((line: string, i: number) => {
        ensureSpace(lineH);
        doc.text(line, M_L + catW, state.y + 3);
        if (i < lines.length - 1) state.y += lineH;
      });
      state.y += lineH + 0.5;
    }
  }

  // ── YABANCI DİLLER ────────────────────────────────────────────────
  const langs = (data.languages ?? []).filter(Boolean);
  if (langs.length) {
    section("Yabancı Diller");
    setF(9.5, "normal");
    setColor(40, 40, 40);
    const lineH = lh(9.5, 1.35);
    ensureSpace(lineH);
    doc.text(langs.join("  ·  "), M_L, state.y + 3);
    state.y += lineH + 1;
  }

  // ── HOBİLER ───────────────────────────────────────────────────────
  const hobbies = (data.hobbies ?? []).filter(Boolean);
  if (hobbies.length) {
    section("Hobiler");
    setF(9.5, "normal");
    setColor(40, 40, 40);
    const lineH = lh(9.5, 1.35);
    ensureSpace(lineH);
    doc.text(hobbies.join("  ·  "), M_L, state.y + 3);
    state.y += lineH + 1;
  }

  doc.setProperties({
    title: `${fullName} — CV`,
    subject: "CV / Özgeçmiş",
    author: fullName,
    creator: "CV Maker",
  });

  doc.save(safeName([data.firstName, data.lastName].filter(Boolean).join(" ") || "CV") + "-CV.pdf");
}

// ── YEDEK: her A4 sayfasını (.cv-page) ayrı yakala, bir PDF sayfasına koy ──
async function exportPdfFromDom(data: CVData): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(".cv-page"));
  if (!nodes.length) throw new Error("CV önizlemesi bulunamadı.");

  const stack = document.querySelector<HTMLElement>(".cv-pages");
  const prevZoom = stack ? stack.style.zoom : null;
  if (stack) stack.style.zoom = "1";

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageW = 210;
  const pageH = 297;

  try {
    for (let i = 0; i < nodes.length; i++) {
      const canvas = await html2canvas(nodes[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: 794,
      });
      const imgH = Math.min(pageH, (canvas.height * pageW) / canvas.width);
      if (i > 0) doc.addPage();
      doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageW, imgH);
    }
  } finally {
    if (stack) stack.style.zoom = prevZoom || "";
  }

  doc.save(safeName([data.firstName, data.lastName].filter(Boolean).join(" ") || "CV") + "-CV.pdf");
}
