// components/form/CVForm.tsx — Sol panelin tamamı
"use client";

import { useRef } from "react";
import type { CVData, Settings } from "@/lib/types";
import { DEFAULT_DATA, EMPTY_DATA, FONT_OPTIONS, ACCENT_OPTIONS, LINE_HEIGHT_OPTIONS } from "@/lib/defaultData";
import PersonalSection from "./PersonalSection";
import { AboutSection, ExperienceSection, EducationSection, ProjectsSection } from "./sections";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import AwardsSection from "./AwardsSection";
import HobbiesSection from "./HobbiesSection";
import JobMatchPanel from "./JobMatchPanel";

const SlidersIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="4"  y1="6"  x2="20" y2="6"  />
    <line x1="4"  y1="12" x2="20" y2="12" />
    <line x1="4"  y1="18" x2="20" y2="18" />
    <circle cx="8"  cy="6"  r="2" fill="white" />
    <circle cx="16" cy="12" r="2" fill="white" />
    <circle cx="10" cy="18" r="2" fill="white" />
  </svg>
);

export default function CVForm({
  data,
  setData,
  settings,
  setSettings,
}: {
  data: CVData;
  setData: (d: CVData) => void;
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
}) {
  const importRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (confirm("Tüm verileri sıfırlamak istediğine emin misin? Bu işlem geri alınamaz.")) {
      setData(DEFAULT_DATA);
    }
  };
  const clearAll = () => {
    if (confirm("Tüm alanları boşaltmak istediğine emin misin?")) {
      setData({ ...EMPTY_DATA, skills: [{ _id: Date.now(), name: "Diller", items: [] }] });
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = [data.firstName, data.lastName].filter(Boolean).join("-") || "cv";
    a.href = url;
    a.download = `${name}-cv.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result as string);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch {
        alert("Geçersiz JSON dosyası.");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  return (
    <aside className="app__form">
      <div className="topbar">
        <h1>
          <span className="dot" />
          CV Maker
          <small>ATS uyumlu</small>
        </h1>
        <div className="topbar__actions">
          <button className="btn btn--ghost" onClick={clearAll} title="Tüm alanları boşalt">
            Temizle
          </button>
          <button className="btn btn--ghost" onClick={reset} title="Örnek veriye dön">
            Sıfırla
          </button>
        </div>
      </div>

      {/* ——— Görsel Stil Paneli ——— */}
      <div className="style-panel">
        <div className="style-panel__hd">
          <SlidersIcon />
          GÖRSEL STİL VE TİPOGRAFİ
        </div>
        <div className="style-panel__body">
          <div className="style-panel__col">
            <label>Tipografi</label>
            <select value={settings.fontId} onChange={(e) => setSettings({ fontId: e.target.value })}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="style-panel__col">
            <label>Satır Boşluğu / Satır Aralığı</label>
            <select value={settings.lineHeightId} onChange={(e) => setSettings({ lineHeightId: e.target.value })}>
              {LINE_HEIGHT_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="style-panel__col">
            <label>CV Vurgu Rengi</label>
            <div className="style-panel__swatches">
              {ACCENT_OPTIONS.map((a) => (
                <button
                  key={a.id}
                  className={"sp-swatch" + (settings.accentId === a.id ? " is-active" : "")}
                  style={{ background: a.val }}
                  title={a.label}
                  onClick={() => setSettings({ accentId: a.id })}
                  aria-label={a.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form">
        <PersonalSection         data={data} setData={setData} />
        <AboutSection            data={data} setData={setData} />
        <ExperienceSection       data={data} setData={setData} />
        <EducationSection        data={data} setData={setData} />
        <ProjectsSection         data={data} setData={setData} />
        <CertificationsSection   data={data} setData={setData} />
        <AwardsSection           data={data} setData={setData} />
        <SkillsSection           data={data} setData={setData} />
        <LanguagesSection        data={data} setData={setData} />
        <HobbiesSection          data={data} setData={setData} />
        <JobMatchPanel           data={data} />

        <div style={{ margin: "18px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input ref={importRef} type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
          <button className="btn" onClick={() => importRef.current?.click()}>
            JSON içe aktar
          </button>
          <button className="btn" onClick={exportJson}>
            JSON dışa aktar
          </button>
        </div>
      </div>
    </aside>
  );
}
