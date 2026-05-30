// components/form/PersonalSection.tsx
"use client";

import { useRef } from "react";
import type { CVData } from "@/lib/types";
import { Section, Field } from "./primitives";

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" />
  </svg>
);

export default function PersonalSection({
  data,
  setData,
}: {
  data: CVData;
  setData: (d: CVData) => void;
}) {
  const upd = <K extends keyof CVData>(k: K, v: CVData[K]) => setData({ ...data, [k]: v });
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => upd("photo", reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <Section icon={<PersonIcon />} title="Kişisel Bilgiler">
      <div className="photo-row">
        <div className="photo-preview">
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photo} alt="" />
          ) : (
            <span>
              fotoğraf
              <br />
              opsiyonel
            </span>
          )}
        </div>
        <div className="photo-controls">
          <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
          <button className="file-btn" onClick={() => fileRef.current?.click()}>
            {data.photo ? "Fotoğrafı değiştir" : "Fotoğraf yükle"}
          </button>
          {data.photo && (
            <button
              className="file-btn"
              onClick={() => upd("photo", null)}
              style={{ background: "#fdf3f2", color: "#c4322a", borderColor: "#f3c8c5" }}
            >
              Fotoğrafı kaldır
            </button>
          )}
          <div className="field__hint">ATS sistemleri için fotoğraf opsiyoneldir.</div>
        </div>
      </div>

      <div className="field--row">
        <Field label="Ad">
          <input type="text" value={data.firstName} onChange={(e) => upd("firstName", e.target.value)} placeholder="Ahmet" />
        </Field>
        <Field label="Soyad">
          <input type="text" value={data.lastName} onChange={(e) => upd("lastName", e.target.value)} placeholder="Yılmaz" />
        </Field>
      </div>
      <Field label="Ünvan / Pozisyon" hint="Örn: Senior Frontend Developer">
        <input type="text" value={data.title} onChange={(e) => upd("title", e.target.value)} placeholder="Yazılım Mühendisi" />
      </Field>
      <div className="field--row">
        <Field label="Telefon">
          <input type="tel" value={data.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="+90 555 000 00 00" />
        </Field>
        <Field label="E-posta">
          <input type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} placeholder="ad@ornek.com" />
        </Field>
      </div>
      <Field label="Adres / Şehir">
        <input type="text" value={data.address} onChange={(e) => upd("address", e.target.value)} placeholder="İstanbul, Türkiye" />
      </Field>
      <div className="field--row">
        <Field label="LinkedIn">
          <input type="text" value={data.linkedin} onChange={(e) => upd("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
        </Field>
        <Field label="GitHub">
          <input type="text" value={data.github} onChange={(e) => upd("github", e.target.value)} placeholder="github.com/..." />
        </Field>
      </div>
      <Field label="Web sitesi (opsiyonel)">
        <input type="text" value={data.website} onChange={(e) => upd("website", e.target.value)} placeholder="ahmetyilmaz.dev" />
      </Field>
    </Section>
  );
}
