// lib/format.ts — Tarih biçimlendirme yardımcıları
import { MONTHS, PRESENT, type Lang } from "./i18n";

export function fmtMonth(ym: string, lang: Lang = "tr"): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const mi = parseInt(m, 10) - 1;
  if (isNaN(mi) || mi < 0 || mi > 11) return ym;
  return `${MONTHS[lang][mi]} ${y}`;
}

export function dateRange(start: string, end: string, current: boolean, lang: Lang = "tr"): string {
  const s = fmtMonth(start, lang);
  const e = current ? PRESENT[lang] : fmtMonth(end, lang);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}
