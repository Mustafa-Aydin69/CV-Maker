// components/form/VolunteerSection.tsx
"use client";

import type { CVData, Volunteer } from "@/lib/types";
import { Field } from "./primitives";
import ListSection from "./ListSection";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function VolunteerSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Volunteer>
      icon={<HeartIcon />}
      title="Gönüllülük / Sosyal Sorumluluk"
      items={data.volunteers ?? []}
      setItems={(v) => setData({ ...data, volunteers: v })}
      factory={() => ({ role: "", organization: "", location: "", start: "", end: "", current: false, description: "" })}
      addLabel="Gönüllülük ekle"
      render={(it, upd) => (
        <>
          <div className="field--row">
            <Field label="Rol / Görev">
              <input type="text" value={it.role} onChange={(e) => upd({ role: e.target.value })} placeholder="Etkinlik Koordinatörü" />
            </Field>
            <Field label="Kurum / Dernek">
              <input type="text" value={it.organization} onChange={(e) => upd({ organization: e.target.value })} placeholder="TEMA Vakfı" />
            </Field>
          </div>
          <Field label="Lokasyon (opsiyonel)">
            <input type="text" value={it.location} onChange={(e) => upd({ location: e.target.value })} placeholder="İstanbul" />
          </Field>
          <div className="field--row">
            <Field label="Başlangıç">
              <input type="month" value={it.start} onChange={(e) => upd({ start: e.target.value })} />
            </Field>
            <Field label="Bitiş">
              <input type="month" value={it.end} disabled={it.current} onChange={(e) => upd({ end: e.target.value })} />
            </Field>
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#5a6275", cursor:"pointer" }}>
            <input type="checkbox" checked={it.current} onChange={(e) => upd({ current: e.target.checked, end: e.target.checked ? "" : it.end })} />
            Halen devam ediyor
          </label>
          <Field label="Açıklama (opsiyonel)" hint="Her satır madde olarak gösterilir.">
            <textarea value={it.description} onChange={(e) => upd({ description: e.target.value })} rows={3}
              placeholder="Yıllık ağaçlandırma etkinliğini 200+ gönüllü ile organize ettim" />
          </Field>
        </>
      )}
    />
  );
}
