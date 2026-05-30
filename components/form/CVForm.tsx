// components/form/CVForm.tsx — Sol panelin tamamı
"use client";

import { useRef, useState, useEffect } from "react";
import type { CVData, Settings } from "@/lib/types";
import { DEFAULT_DATA, EMPTY_DATA, FONT_OPTIONS, ACCENT_OPTIONS, LINE_HEIGHT_OPTIONS } from "@/lib/defaultData";
import type { CVDocument } from "@/hooks/useDocuments";
import { SECTION_DEFS, MARGIN_OPTIONS } from "@/lib/defaultData";
import PersonalSection from "./PersonalSection";
import { AboutSection, ExperienceSection, EducationSection, ProjectsSection } from "./sections";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import AwardsSection from "./AwardsSection";
import HobbiesSection from "./HobbiesSection";
import JobMatchPanel from "./JobMatchPanel";
import VolunteerSection from "./VolunteerSection";
import ReferencesSection from "./ReferencesSection";
import CustomSectionsPanel from "./CustomSectionsPanel";
import LinkedInImportPanel from "./LinkedInImportPanel";
import ShortcutsPanel from "@/components/ShortcutsPanel";
import type { AtsScore } from "@/lib/types";

// ── İkonlar ──────────────────────────────────────────────────────────────────

// ── Kayıt göstergesi hook'u ───────────────────────────────────────────────────

function useSaveLabel(lastSavedAt: number): string {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!lastSavedAt) return;
    const update = () => {
      const s = Math.floor((Date.now() - lastSavedAt) / 1000);
      if (s < 5)  setLabel("Az önce kaydedildi");
      else if (s < 60)  setLabel(`${s} sn önce kaydedildi`);
      else if (s < 3600) setLabel(`${Math.floor(s / 60)} dk önce kaydedildi`);
      else setLabel("Kaydedildi");
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  return label;
}

// ── Stil Paneli ──────────────────────────────────────────────────────────────

function StylePanel({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
}) {
  const [soOpen, setSoOpen] = useState(false);
  const sectionOrder   = settings.sectionOrder   ?? [];
  const hiddenSections = settings.hiddenSections ?? [];

  return (
    <div className="style-panel">
      <div className="style-panel__hd">
        <SlidersIcon />
        GÖRSEL STİL VE TİPOGRAFİ
      </div>

      {/* Satır 1: Tipografi · Satır Aralığı · Renk */}
      <div className="style-panel__body">
        <div className="style-panel__col">
          <label>Tipografi</label>
          <select value={settings.fontId} onChange={(e) => setSettings({ fontId: e.target.value })}>
            {FONT_OPTIONS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
        <div className="style-panel__col">
          <label>Satır Aralığı</label>
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
            {/* Özel renk */}
            <label
              className={"sp-swatch sp-swatch--custom" + (settings.accentId === "custom" ? " is-active" : "")}
              title="Özel renk seç"
              style={{ background: settings.accentId === "custom" ? (settings.accentCustom ?? "#2563eb") : "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)" }}
            >
              <input type="color" value={settings.accentCustom ?? "#2563eb"}
                onChange={(e) => setSettings({ accentId: "custom", accentCustom: e.target.value })}
                style={{ opacity:0, position:"absolute", width:0, height:0 }} />
            </label>
          </div>
        </div>
      </div>

      {/* Satır 2: Kenar Boşluğu · Yazı Boyutu */}
      <div className="style-panel__body style-panel__body--row2">
        <div className="style-panel__col">
          <label>Kenar Boşluğu</label>
          <select value={settings.marginId ?? "normal"} onChange={(e) => setSettings({ marginId: e.target.value })}>
            {MARGIN_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div className="style-panel__col style-panel__col--range">
          <label>
            Yazı Boyutu
            <span className="style-panel__val">{Math.round((settings.fontScale ?? 1) * 100)}%</span>
          </label>
          <input
            type="range"
            min={0.85} max={1.15} step={0.05}
            value={settings.fontScale ?? 1}
            onChange={(e) => setSettings({ fontScale: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      {/* Şablon seçimi */}
      <div className="template-row">
        <span className="template-row__label">Şablon</span>
        <div className="template-row__opts">
          {(["classic", "sidebar"] as const).map((t) => (
            <button
              key={t}
              className={"template-btn" + (settings.template === t ? " is-active" : "")}
              onClick={() => setSettings({ template: t })}
            >
              {t === "classic" ? "Klasik" : "Şeritli"}
            </button>
          ))}
        </div>
      </div>

      {/* Bölüm Düzeni (açılır) */}
      <button className="so-toggle" onClick={() => setSoOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points={soOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
        BÖLÜM DÜZENİ
        <span className="so-toggle__count">
          {hiddenSections.length > 0 ? `${hiddenSections.length} gizli` : "tümü görünür"}
        </span>
      </button>

      {soOpen && (
        <SectionOrderList
          sectionOrder={sectionOrder}
          hiddenSections={hiddenSections}
          onChange={(order, hidden) => setSettings({ sectionOrder: order, hiddenSections: hidden })}
        />
      )}
    </div>
  );
}

// ── Bölüm Düzeni Listesi (sürükle-bırak + göster/gizle) ──────────────────────

function SectionOrderList({
  sectionOrder,
  hiddenSections,
  onChange,
}: {
  sectionOrder: string[];
  hiddenSections: string[];
  onChange: (order: string[], hidden: string[]) => void;
}) {
  const dragId = useRef<string | null>(null);

  const reorder = (fromId: string, toId: string) => {
    const from = sectionOrder.indexOf(fromId);
    const to   = sectionOrder.indexOf(toId);
    if (from === to) return;
    const next = [...sectionOrder];
    next.splice(from, 1);
    next.splice(to, 0, fromId);
    onChange(next, hiddenSections);
  };

  const toggle = (id: string) => {
    const next = hiddenSections.includes(id)
      ? hiddenSections.filter((h) => h !== id)
      : [...hiddenSections, id];
    onChange(sectionOrder, next);
  };

  return (
    <div className="so-list">
      {sectionOrder.map((id) => {
        const def = SECTION_DEFS.find((s) => s.id === id);
        if (!def) return null;
        const hidden = hiddenSections.includes(id);
        return (
          <div
            key={id}
            className={"so-item" + (hidden ? " so-item--hidden" : "")}
            draggable
            onDragStart={() => { dragId.current = id; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragId.current) reorder(dragId.current, id); dragId.current = null; }}
            onDragEnd={() => { dragId.current = null; }}
          >
            <span className="so-item__drag" aria-hidden="true">⋮⋮</span>
            <label className="so-item__label">
              <input
                type="checkbox"
                checked={!hidden}
                onChange={() => toggle(id)}
              />
              {def.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

const SlidersIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="white" /><circle cx="16" cy="12" r="2" fill="white" /><circle cx="10" cy="18" r="2" fill="white" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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
  docs, activeId, switchDoc, createDoc, duplicateDoc, deleteDoc, renameDoc,
  score, saveLabel,
}: {
  docs: CVDocument[];
  activeId: string;
  switchDoc: (id: string) => void;
  createDoc: () => void;
  duplicateDoc: () => void;
  deleteDoc: (id: string) => void;
  renameDoc: (id: string, name: string) => void;
  score: AtsScore;
  saveLabel: string;
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
    <>
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
      {saveLabel && (
        <span className="doc-bar__saved">{saveLabel}</span>
      )}
    </div>
    {/* ATS tamamlanma çubuğu */}
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{
          width: `${score.pct}%`,
          background: score.pct >= 80 ? "#1f7a44" : score.pct >= 50 ? "#d9a020" : "#c4322a",
        }}
      />
    </div>
    </>
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
  score,
  lastSavedAt,
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
  score: AtsScore;
  lastSavedAt: number;
}) {
  const importRef = useRef<HTMLInputElement>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // "?" tuşu kısayol panelini aç/kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "?") setShortcutsOpen((o) => !o);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
    <>
    <aside className="app__form" data-dark={settings.darkMode ? "true" : undefined}>
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
          <button
            className="icon-btn"
            onClick={() => setSettings({ darkMode: !settings.darkMode })}
            title={settings.darkMode ? "Açık mod" : "Koyu mod"}
            aria-label="Tema değiştir"
          >
            {settings.darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="icon-btn"
            onClick={() => setShortcutsOpen(true)}
            title="Klavye kısayolları (?)"
            aria-label="Kısayollar"
            style={{ fontSize: 13, fontWeight: 700 }}
          >
            ?
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
        score={score}
        saveLabel={useSaveLabel(lastSavedAt)}
      />

      {/* ── Görsel Stil Paneli ── */}
      <StylePanel settings={settings} setSettings={setSettings} />

      {/* ── Form Bölümleri ── */}
      <div className="form">
        <PersonalSection       data={data} setData={setData} />
        <AboutSection          data={data} setData={setData} />
        <ExperienceSection     data={data} setData={setData} />
        <EducationSection      data={data} setData={setData} />
        <ProjectsSection       data={data} setData={setData} />
        <CertificationsSection data={data} setData={setData} />
        <AwardsSection         data={data} setData={setData} />
        <VolunteerSection      data={data} setData={setData} />
        <ReferencesSection     data={data} setData={setData} />
        <SkillsSection         data={data} setData={setData} />
        <LanguagesSection      data={data} setData={setData} />
        <HobbiesSection        data={data} setData={setData} />
        <CustomSectionsPanel   data={data} setData={setData} />
        <LinkedInImportPanel   data={data} setData={setData} />
        <JobMatchPanel         data={data} />

        <div style={{ margin: "18px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input ref={importRef} type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
          <button className="btn" onClick={() => importRef.current?.click()}>JSON içe aktar</button>
          <button className="btn" onClick={exportJson}>JSON dışa aktar</button>
        </div>
      </div>
    </aside>
    {shortcutsOpen && <ShortcutsPanel onClose={() => setShortcutsOpen(false)} />}
    </>
  );
}
