// components/form/ReferencesSection.tsx
"use client";

import type { CVData, Reference } from "@/lib/types";
import { Field } from "./primitives";
import ListSection from "./ListSection";

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function ReferencesSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Reference>
      icon={<UsersIcon />}
      title="Referanslar"
      items={data.references ?? []}
      setItems={(v) => setData({ ...data, references: v })}
      factory={() => ({ name: "", title: "", company: "", email: "", phone: "", note: "" })}
      addLabel="Referans ekle"
      render={(it, upd) => (
        <>
          <Field label="Ad Soyad">
            <input type="text" value={it.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Ahmet Yılmaz" />
          </Field>
          <div className="field--row">
            <Field label="Ünvan">
              <input type="text" value={it.title} onChange={(e) => upd({ title: e.target.value })} placeholder="Kıdemli Müdür" />
            </Field>
            <Field label="Şirket">
              <input type="text" value={it.company} onChange={(e) => upd({ company: e.target.value })} placeholder="Örnek A.Ş." />
            </Field>
          </div>
          <div className="field--row">
            <Field label="E-posta (opsiyonel)">
              <input type="email" value={it.email} onChange={(e) => upd({ email: e.target.value })} placeholder="ahmet@ornek.com" />
            </Field>
            <Field label="Telefon (opsiyonel)">
              <input type="tel" value={it.phone} onChange={(e) => upd({ phone: e.target.value })} placeholder="+90 555..." />
            </Field>
          </div>
          <Field label="Not (opsiyonel)">
            <input type="text" value={it.note} onChange={(e) => upd({ note: e.target.value })} placeholder="İstek üzerine sağlanacaktır" />
          </Field>
        </>
      )}
    />
  );
}
