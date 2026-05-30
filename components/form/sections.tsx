// components/form/sections.tsx — Hakkımda, Deneyim, Eğitim, Projeler
"use client";

import type { CVData, Experience, Education, Project } from "@/lib/types";
import { Section, Field } from "./primitives";
import ListSection from "./ListSection";

export function AboutSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const len = data.about?.length || 0;
  return (
    <Section icon="✎" title="Hakkımda">
      <Field
        label="Profesyonel özet"
        hint={`${len} karakter — ATS için 50-150 kelime ideal. Anahtar yetkinlikleri vurgulayın.`}
      >
        <textarea
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
          placeholder="5+ yıl deneyimli, ölçeklenebilir web uygulamaları geliştiren bir yazılım mühendisiyim. React, TypeScript ve Node.js teknolojilerinde uzmanım..."
          rows={5}
        />
      </Field>
    </Section>
  );
}

export function ExperienceSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Experience>
      icon="💼"
      title="Deneyim"
      items={data.experience}
      setItems={(v) => setData({ ...data, experience: v })}
      factory={() => ({ role: "", company: "", location: "", start: "", end: "", current: false, description: "" })}
      addLabel="Deneyim ekle"
      render={(it, upd) => (
        <>
          <div className="field--row">
            <Field label="Pozisyon">
              <input type="text" value={it.role} onChange={(e) => upd({ role: e.target.value })} placeholder="Frontend Developer" />
            </Field>
            <Field label="Şirket">
              <input type="text" value={it.company} onChange={(e) => upd({ company: e.target.value })} placeholder="Acme A.Ş." />
            </Field>
          </div>
          <Field label="Lokasyon">
            <input type="text" value={it.location} onChange={(e) => upd({ location: e.target.value })} placeholder="İstanbul, Türkiye (Hibrit)" />
          </Field>
          <div className="field--row">
            <Field label="Başlangıç">
              <input type="month" value={it.start} onChange={(e) => upd({ start: e.target.value })} />
            </Field>
            <Field label="Bitiş">
              <input type="month" value={it.end} disabled={it.current} onChange={(e) => upd({ end: e.target.value })} />
            </Field>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5a6275", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={it.current}
              onChange={(e) => upd({ current: e.target.checked, end: e.target.checked ? "" : it.end })}
            />
            Halen çalışıyorum
          </label>
          <Field label="Açıklama / Başarılar" hint="Her satır yeni bir madde. Eylem fiili + sonuç + metrik kullanın.">
            <textarea
              value={it.description}
              onChange={(e) => upd({ description: e.target.value })}
              placeholder={
                "React/TypeScript ile e-ticaret platformunu geliştirdim, sayfa yüklenme süresini %40 düşürdüm\nMicrofrontend mimarisine geçişi 4 kişilik ekiple yönettim\n12+ junior geliştiriciye mentörlük yaptım"
              }
              rows={4}
            />
          </Field>
        </>
      )}
    />
  );
}

export function EducationSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Education>
      icon="🎓"
      title="Eğitim"
      items={data.education}
      setItems={(v) => setData({ ...data, education: v })}
      factory={() => ({ school: "", degree: "", field: "", start: "", end: "", gpa: "", notes: "" })}
      addLabel="Eğitim ekle"
      render={(it, upd) => (
        <>
          <Field label="Okul / Üniversite">
            <input type="text" value={it.school} onChange={(e) => upd({ school: e.target.value })} placeholder="Boğaziçi Üniversitesi" />
          </Field>
          <div className="field--row">
            <Field label="Derece">
              <input type="text" value={it.degree} onChange={(e) => upd({ degree: e.target.value })} placeholder="Lisans" />
            </Field>
            <Field label="Bölüm">
              <input type="text" value={it.field} onChange={(e) => upd({ field: e.target.value })} placeholder="Bilgisayar Mühendisliği" />
            </Field>
          </div>
          <div className="field--row">
            <Field label="Başlangıç">
              <input type="month" value={it.start} onChange={(e) => upd({ start: e.target.value })} />
            </Field>
            <Field label="Bitiş">
              <input type="month" value={it.end} onChange={(e) => upd({ end: e.target.value })} />
            </Field>
          </div>
          <Field label="GPA / Not (opsiyonel)">
            <input type="text" value={it.gpa} onChange={(e) => upd({ gpa: e.target.value })} placeholder="3.45 / 4.00" />
          </Field>
          <Field label="Notlar (opsiyonel)" hint="Onur listesi, ilgili dersler, tezler...">
            <textarea value={it.notes} onChange={(e) => upd({ notes: e.target.value })} rows={2} placeholder="Onur öğrencisi, Bitirme: AI tabanlı tavsiye sistemi" />
          </Field>
        </>
      )}
    />
  );
}

export function ProjectsSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  return (
    <ListSection<Project>
      icon="🛠"
      title="Projeler"
      items={data.projects}
      setItems={(v) => setData({ ...data, projects: v })}
      factory={() => ({ name: "", stack: "", link: "", description: "" })}
      addLabel="Proje ekle"
      render={(it, upd) => (
        <>
          <Field label="Proje adı">
            <input type="text" value={it.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Görev Yönetim Uygulaması" />
          </Field>
          <Field label="Teknolojiler">
            <input type="text" value={it.stack} onChange={(e) => upd({ stack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
          </Field>
          <Field label="Bağlantı (opsiyonel)">
            <input type="text" value={it.link} onChange={(e) => upd({ link: e.target.value })} placeholder="github.com/.../proje" />
          </Field>
          <Field label="Açıklama" hint="Her satır yeni bir madde olarak gösterilir.">
            <textarea
              value={it.description}
              onChange={(e) => upd({ description: e.target.value })}
              rows={3}
              placeholder={"Gerçek zamanlı işbirliği özelliği WebSocket ile entegre edildi\n200+ kullanıcıya hizmet veriyor"}
            />
          </Field>
        </>
      )}
    />
  );
}
