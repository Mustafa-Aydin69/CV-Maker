// components/form/CertificationsSection.tsx
"use client";

import type { CVData, Certification } from "@/lib/types";
import { Field } from "./primitives";
import ListSection from "./ListSection";

const CertIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15l2 2 4-4" />
  </svg>
);

export default function CertificationsSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Certification>
      icon={<CertIcon />}
      title="Sertifikalar & Kurslar"
      items={data.certifications ?? []}
      setItems={(v) => setData({ ...data, certifications: v })}
      factory={() => ({ name: "", issuer: "", date: "", link: "" })}
      addLabel="Sertifika ekle"
      render={(it, upd) => (
        <>
          <Field label="Sertifika / Kurs adı">
            <input
              type="text"
              value={it.name}
              onChange={(e) => upd({ name: e.target.value })}
              placeholder="AWS Certified Solutions Architect"
            />
          </Field>
          <div className="field--row">
            <Field label="Kurum / Platform">
              <input
                type="text"
                value={it.issuer}
                onChange={(e) => upd({ issuer: e.target.value })}
                placeholder="Coursera, AWS, Google…"
              />
            </Field>
            <Field label="Tarih">
              <input type="month" value={it.date} onChange={(e) => upd({ date: e.target.value })} />
            </Field>
          </div>
          <Field label="Bağlantı (opsiyonel)">
            <input
              type="text"
              value={it.link}
              onChange={(e) => upd({ link: e.target.value })}
              placeholder="credential url veya sertifika linki"
            />
          </Field>
        </>
      )}
    />
  );
}
