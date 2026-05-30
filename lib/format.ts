// lib/format.ts — Tarih biçimlendirme yardımcıları

const TR_MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export function fmtMonth(ym: string): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const mi = parseInt(m, 10) - 1;
  if (isNaN(mi) || mi < 0 || mi > 11) return ym;
  return `${TR_MONTHS[mi]} ${y}`;
}

export function dateRange(start: string, end: string, current: boolean): string {
  const s = fmtMonth(start);
  const e = current ? "Halen" : fmtMonth(end);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}
