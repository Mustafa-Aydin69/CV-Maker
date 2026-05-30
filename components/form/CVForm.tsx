// components/form/CVForm.tsx — Sol panelin tamamı
"use client";

import { useRef } from "react";
import type { CVData } from "@/lib/types";
import { DEFAULT_DATA, EMPTY_DATA } from "@/lib/defaultData";
import PersonalSection from "./PersonalSection";
import { AboutSection, ExperienceSection, EducationSection, ProjectsSection } from "./sections";
import SkillsSection from "./SkillsSection";

export default function CVForm({
  data,
  setData,
}: {
  data: CVData;
  setData: (d: CVData) => void;
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
      <div className="form">
        <PersonalSection data={data} setData={setData} />
        <AboutSection data={data} setData={setData} />
        <ExperienceSection data={data} setData={setData} />
        <EducationSection data={data} setData={setData} />
        <ProjectsSection data={data} setData={setData} />
        <SkillsSection data={data} setData={setData} />

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
