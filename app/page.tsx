// app/page.tsx — Ana uygulama
"use client";

import { useEffect, useMemo } from "react";
import type { Settings } from "@/lib/types";
import { DEFAULT_SETTINGS, SETTINGS_KEY, FONT_OPTIONS, ACCENT_OPTIONS, LINE_HEIGHT_OPTIONS } from "@/lib/defaultData";
import { computeAtsScore } from "@/lib/atsScore";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDocuments } from "@/hooks/useDocuments";
import { useHistory } from "@/hooks/useHistory";
import CVForm from "@/components/form/CVForm";
import PreviewPane from "@/components/PreviewPane";
import SettingsPanel from "@/components/SettingsPanel";

export default function Page() {
  const docsMgr = useDocuments();
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  const patchSettings = (patch: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const { data, setData, undo, redo, canUndo, canRedo } = useHistory(
    docsMgr.activeData,
    docsMgr.setActiveData,
    docsMgr.activeId,
  );

  // Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z klavye kısayolları
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === "y") || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const score = useMemo(() => computeAtsScore(data), [data]);
  const font = FONT_OPTIONS.find((f) => f.id === settings.fontId) || FONT_OPTIONS[0];
  const accent = ACCENT_OPTIONS.find((a) => a.id === settings.accentId) || ACCENT_OPTIONS[0];
  const lineHeight = LINE_HEIGHT_OPTIONS.find((l) => l.id === settings.lineHeightId)?.val ?? "1.45";

  return (
    <div className="app">
      <CVForm
        data={data}
        setData={setData}
        settings={settings}
        setSettings={patchSettings}
        docs={docsMgr.docs}
        activeId={docsMgr.activeId}
        switchDoc={docsMgr.switchDoc}
        createDoc={docsMgr.createDoc}
        duplicateDoc={docsMgr.duplicateDoc}
        deleteDoc={docsMgr.deleteDoc}
        renameDoc={docsMgr.renameDoc}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <PreviewPane
        data={data}
        settings={settings}
        setSettings={patchSettings}
        score={score}
        font={font}
        accent={accent}
        lineHeight={lineHeight}
      />
      <SettingsPanel settings={settings} setSettings={patchSettings} score={score} />
    </div>
  );
}
