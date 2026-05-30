// components/form/LinkedInImportPanel.tsx — LinkedIn CSV arşivinden içe aktarma
"use client";

import { useRef, useState } from "react";
import type { CVData } from "@/lib/types";
import { Section } from "./primitives";
import { importLinkedInFiles, mergeLinkedIn } from "@/lib/linkedinImport";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FILE_HINTS = [
  "Profile.csv",
  "Positions.csv",
  "Education.csv",
  "Skills.csv",
  "Languages.csv",
];

const TYPE_LABELS: Record<string, string> = {
  profile:   "Profil",
  positions: "Deneyimler",
  education: "Eğitim",
  skills:    "Yetenekler",
  languages: "Diller",
};

export default function LinkedInImportPanel({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: string[]; skip: string[] } | null>(null);
  const [busy,   setBusy]   = useState(false);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    setStatus(null);
    try {
      const result = await importLinkedInFiles(files);
      const merged = mergeLinkedIn(data, result.data);
      setData(merged);
      setStatus({
        ok:   result.imported.map((t) => TYPE_LABELS[t] ?? t),
        skip: result.skipped,
      });
    } catch {
      alert("Dosyalar okunurken bir hata oluştu.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <Section icon={<LinkedInIcon />} title="LinkedIn'den İçe Aktar" defaultOpen={false}>
      <div className="li-import">
        <p className="li-import__desc">
          LinkedIn → Ayarlar → Gizlilik → Veri arşivini al → İstediğiniz veriyi seçin
          (Profil, Pozisyonlar, Eğitim, Beceriler, Diller). İndirilen ZIP&apos;i açıp ilgili
          CSV dosyalarını seçin.
        </p>

        <div className="li-import__files">
          {FILE_HINTS.map((f) => (
            <span key={f} className="li-import__badge">{f}</span>
          ))}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          multiple
          onChange={onFiles}
          style={{ display: "none" }}
        />
        <button
          className="btn"
          style={{ width: "100%", marginTop: 4 }}
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? "İçe aktarılıyor…" : "CSV dosyaları seç…"}
        </button>

        {status && (
          <div className="li-import__result">
            {status.ok.length > 0 && (
              <div className="li-import__ok">
                ✓ İçe aktarıldı: {status.ok.join(", ")}
              </div>
            )}
            {status.skip.length > 0 && (
              <div className="li-import__skip">
                Tanınmadı: {status.skip.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
