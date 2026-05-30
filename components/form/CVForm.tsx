// components/form/CVForm.tsx — Sol panelin tamamı
"use client";

import { useRef, useState } from "react";
import type { CVData, Settings } from "@/lib/types";
import { DEFAULT_DATA, EMPTY_DATA, FONT_OPTIONS, ACCENT_OPTIONS, LINE_HEIGHT_OPTIONS } from "@/lib/defaultData";
import type { CVDocument } from "@/hooks/useDocuments";
import PersonalSection from "./PersonalSection";
import { AboutSection, ExperienceSection, EducationSection, ProjectsSection } from "./sections";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import AwardsSection from "./AwardsSection";
import HobbiesSection from "./HobbiesSection";
import JobMatchPanel from "./JobMatchPanel";

// ── İkonlar ──────────────────────────────────────────────────────────────────

const SlidersIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="white" /><circle cx="16" cy="12" r="2" fill="white" /><circle cx="10" cy="18" r="2" fill="white" />
  </svg>
);
const UndoIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ── Belge Çubuğu ─────────────────────────────────────────────────────────────

function DocBar({
  docs,
  activeId,
  switchDoc,
  createDoc,
  duplicateDoc,
  deleteDoc,
  renameDoc,
}: {
  docs: CVDocument[];
  activeId: string;
  switchDoc: (id: string) => void;
  createDoc: () => void;
  duplicateDoc: () => void;
  deleteDoc: (id: string) => void;
  renameDoc: (id: string, name: string) => void;
}) {
  const activeDoc = docs.find((d) => d.id === activeId);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startRename = () => {
    setDraftName(activeDoc?.name ?? "");
    setRenaming(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };
  const commitRename = () => {
    if (activeDoc && draftName.trim()) renameDoc(activeId, draftName.trim());
    setRenaming(false);
  };

  return (
    <div className="doc-bar">
      <div className="doc-bar__left">
        {renaming ? (
          <input
            ref={inputRef}
            className="doc-bar__rename"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setRenaming(false);
            }}
          />
        ) : (
          <button className="doc-bar__name" onClick={startRename} title="Yeniden adlandır (tıkla)">
            {activeDoc?.name ?? "CV"}
          </button>
        )}

        {docs.length > 1 && (
          <select
            className="doc-bar__select"
            value={activeId}
            onChange={(e) => switchDoc(e.target.value)}
            title="CV'ler arasında geç"
          >
            {docs.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="doc-bar__actions">
        <button className="icon-btn" onClick={createDoc} title="Yeni CV oluştur">
          <PlusIcon />
        </button>
        <button className="icon-btn" onClick={duplicateDoc} title="Bu CV'yi kopyala">
          <CopyIcon />
        </button>
        {docs.length > 1 && (
          <button
            className="icon-btn icon-btn--danger"
            onClick={() => {
              if (confirm(`"${activeDoc?.name}" silinecek. Emin misin?`)) deleteDoc(activeId);
            }}
            title="Bu CV'yi sil"
          >
            <TrashIcon />
          </button>
        )}
        <span className="doc-bar__count">{docs.length} CV</span>
      </div>
    </div>
  );
}

// ── Ana Bileşen ───────────────────────────────────────────────────────────────

export default function CVForm({
  data,
  setData,
  settings,
  setSettings,
  docs,
  activeId,
  switchDoc,
  createDoc,
  duplicateDoc,
  deleteDoc,
  renameDoc,
  undo,
  redo,
  canUndo,
  canRedo,
}: {
  data: CVData;
  setData: (d: CVData) => void;
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  docs: CVDocument[];
  activeId: string;
  switchDoc: (id: string) => void;
  createDoc: () => void;
  duplicateDoc: () => void;
  deleteDoc: (id: string) => void;
  renameDoc: (id: string, name: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const importRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (confirm("Tüm verileri sıfırlamak istediğine emin misin? Bu işlem geri alınamaz."))
      setData(DEFAULT_DATA);
  };
  const clearAll = () => {
    if (confirm("Tüm alanları boşaltmak istediğine emin misin?"))
      setData({ ...EMPTY_DATA, skills: [{ _id: Date.now(), name: "Diller", items: [] }] });
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
      try { setData({ ...DEFAULT_DATA, ...JSON.parse(r.result as string) }); }
      catch { alert("Geçersiz JSON dosyası."); }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  return (
    <aside className="app__form">
      {/* ── Üst çubuk ── */}
      <div className="topbar">
        <h1>
          <span className="dot" />
          CV Maker
          <small>ATS uyumlu</small>
        </h1>
        <div className="topbar__actions">
          <button
            className="icon-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Geri al (Ctrl+Z)"
            aria-label="Geri al"
          >
            <UndoIcon />
          </button>
          <button
            className="icon-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Yinele (Ctrl+Y)"
            aria-label="Yinele"
          >
            <RedoIcon />
          </button>
          <button className="btn btn--ghost" onClick={clearAll} title="Tüm alanları boşalt">Temizle</button>
          <button className="btn btn--ghost" onClick={reset}    title="Örnek veriye dön">Sıfırla</button>
        </div>
      </div>

      {/* ── Belge çubuğu ── */}
      <DocBar
        docs={docs}
        activeId={activeId}
        switchDoc={switchDoc}
        createDoc={createDoc}
        duplicateDoc={duplicateDoc}
        deleteDoc={deleteDoc}
        renameDoc={renameDoc}
      />

      {/* ── Görsel Stil Paneli ── */}
      <div className="style-panel">
        <div className="style-panel__hd">
          <SlidersIcon />
          GÖRSEL STİL VE TİPOGRAFİ
        </div>
        <div className="style-panel__body">
          <div className="style-panel__col">
            <label>Tipografi</label>
            <select value={settings.fontId} onChange={(e) => setSettings({ fontId: e.target.value })}>
              {FONT_OPTIONS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div className="style-panel__col">
            <label>Satır Boşluğu / Satır Aralığı</label>
            <select value={settings.lineHeightId} onChange={(e) => setSettings({ lineHeightId: e.target.value })}>
              {LINE_HEIGHT_OPTIONS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
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

      {/* ── Form Bölümleri ── */}
      <div className="form">
        <PersonalSection       data={data} setData={setData} />
        <AboutSection          data={data} setData={setData} />
        <ExperienceSection     data={data} setData={setData} />
        <EducationSection      data={data} setData={setData} />
        <ProjectsSection       data={data} setData={setData} />
        <CertificationsSection data={data} setData={setData} />
        <AwardsSection         data={data} setData={setData} />
        <SkillsSection         data={data} setData={setData} />
        <LanguagesSection      data={data} setData={setData} />
        <HobbiesSection        data={data} setData={setData} />
        <JobMatchPanel         data={data} />

        <div style={{ margin: "18px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input ref={importRef} type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
          <button className="btn" onClick={() => importRef.current?.click()}>JSON içe aktar</button>
          <button className="btn" onClick={exportJson}>JSON dışa aktar</button>
        </div>
      </div>
    </aside>
  );
}
