// lib/atsScore.ts — ATS uyum skoru (sezgisel kontroller)

import type { CVData, AtsScore, AtsCheck } from "./types";

export function computeAtsScore(data: CVData): AtsScore {
  const checks: AtsCheck[] = [];
  const push = (ok: boolean, label: string) => checks.push({ ok, label });

  push(!!(data.firstName && data.lastName), "Ad ve soyad mevcut");
  push(!!data.title, "Ünvan / pozisyon belirtildi");
  push(!!data.email && /@/.test(data.email), "Geçerli e-posta");
  push(!!data.phone, "Telefon numarası");
  push(!!(data.about && data.about.trim().length >= 80), "Hakkımda 80+ karakter");
  push(data.experience.length > 0, "En az 1 deneyim");
  push(
    data.experience.every((e) => !!e.role && !!e.company && !!e.start),
    "Deneyimler eksiksiz (pozisyon, şirket, tarih)"
  );
  push(
    data.experience.some((e) => (e.description || "").length > 40),
    "Deneyimde açıklama / metrikler var"
  );
  push(data.education.length > 0, "En az 1 eğitim");
  push(
    data.skills.some((c) => c.items.length >= 3),
    "En az bir kategoride 3+ yetenek"
  );

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const pct = Math.round((passed / total) * 100);
  return { pct, passed, total, checks };
}
