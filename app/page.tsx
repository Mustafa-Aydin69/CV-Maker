// app/page.tsx — Ana uygulama
"use client";

import { useMemo } from "react";
import type { CVData, Settings } from "@/lib/types";
import { DEFAULT_DATA, DEFAULT_SETTINGS, STORAGE_KEY, SETTINGS_KEY, FONT_OPTIONS, ACCENT_OPTIONS } from "@/lib/defaultData";
import { computeAtsScore } from "@/lib/atsScore";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CVForm from "@/components/form/CVForm";
import PreviewPane from "@/components/PreviewPane";
import SettingsPanel from "@/components/SettingsPanel";

export default function Page() {
  const [data, setData] = useLocalStorage<CVData>(STORAGE_KEY, DEFAULT_DATA);
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  const patchSettings = (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch }));

  const score = useMemo(() => computeAtsScore(data), [data]);
  const font = FONT_OPTIONS.find((f) => f.id === settings.fontId) || FONT_OPTIONS[0];
  const accent = ACCENT_OPTIONS.find((a) => a.id === settings.accentId) || ACCENT_OPTIONS[0];

  return (
    <div className="app">
      <CVForm data={data} setData={(d) => setData(d)} />
      <PreviewPane
        data={data}
        settings={settings}
        setSettings={patchSettings}
        score={score}
        font={font}
        accent={accent}
      />
      <SettingsPanel settings={settings} setSettings={patchSettings} score={score} />
    </div>
  );
}
