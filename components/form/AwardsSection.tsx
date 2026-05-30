// components/form/AwardsSection.tsx
"use client";

import type { CVData, Award } from "@/lib/types";
import { Field } from "./primitives";
import ListSection from "./ListSection";

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1.4" />
    <path d="M14 14.66V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1.4" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

export default function AwardsSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Award>
      icon={<TrophyIcon />}
      title="Ödüller & Başarılar"
      items={data.awards ?? []}
      setItems={(v) => setData({ ...data, awards: v })}
      factory={() => ({ title: "", issuer: "", date: "", note: "" })}
      addLabel="Ödül ekle"
      render={(it, upd) => (
        <>
          <Field label="Ödül / Başarı başlığı">
            <input
              type="text"
              value={it.title}
              onChange={(e) => upd({ title: e.target.value })}
              placeholder="Yılın En İyi Geliştirici"
            />
          </Field>
          <div className="field--row">
            <Field label="Veren kurum">
              <input
                type="text"
                value={it.issuer}
                onChange={(e) => upd({ issuer: e.target.value })}
                placeholder="Şirket, Dernek, Üniversite…"
              />
            </Field>
            <Field label="Tarih">
              <input type="month" value={it.date} onChange={(e) => upd({ date: e.target.value })} />
            </Field>
          </div>
          <Field label="Açıklama (opsiyonel)">
            <input
              type="text"
              value={it.note}
              onChange={(e) => upd({ note: e.target.value })}
              placeholder="200+ aday arasından seçildi"
            />
          </Field>
        </>
      )}
    />
  );
}
