// components/form/ActivitySection.tsx — Yarışma takımları, kulüpler ve topluluk rolleri
"use client";

import type { CVData, Activity } from "@/lib/types";
import { Field } from "./primitives";
import ListSection from "./ListSection";

const FlagIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

export default function ActivitySection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Activity>
      icon={<FlagIcon />}
      title="Takımlar & Topluluklar"
      items={data.activities ?? []}
      setItems={(v) => setData({ ...data, activities: v })}
      factory={() => ({ role: "", organization: "", start: "", end: "", current: false, description: "" })}
      addLabel="Takım / topluluk ekle"
      render={(it, upd) => (
        <>
          <div className="field--row">
            <Field label="Rol / Görev">
              <input type="text" value={it.role} onChange={(e) => upd({ role: e.target.value })} placeholder="Yazılım Sorumlusu" />
            </Field>
            <Field label="Takım / Kulüp">
              <input type="text" value={it.organization} onChange={(e) => upd({ organization: e.target.value })} placeholder="Teknofest İHA Takımı" />
            </Field>
          </div>
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
          <Field label="Açıklama (opsiyonel)" hint="Her satır madde olarak gösterilir. Sonuç ve derece yazmak etkiyi artırır.">
            <textarea value={it.description} onChange={(e) => upd({ description: e.target.value })} rows={3}
              placeholder={"Otonom uçuş yazılımını geliştirdim; takım finalde 3. oldu\n12 kişilik ekipte görev dağılımını koordine ettim"} />
          </Field>
        </>
      )}
    />
  );
}
