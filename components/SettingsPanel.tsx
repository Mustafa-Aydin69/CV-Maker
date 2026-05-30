// components/SettingsPanel.tsx — Zoom, fotoğraf ve ATS kontrol listesi
"use client";

import { useState } from "react";
import type { Settings, AtsScore } from "@/lib/types";

export default function SettingsPanel({
  settings,
  setSettings,
  score,
}: {
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  score: AtsScore;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="settings-fab" onClick={() => setOpen(true)} title="Görünüm ayarları" aria-label="Görünüm ayarları">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel__hd">
        <b>Önizleme Ayarları</b>
        <button className="settings-panel__x" onClick={() => setOpen(false)} aria-label="Kapat">
          ✕
        </button>
      </div>
      <div className="settings-panel__body">
        <div className="settings-sect">Düzen</div>
        <label className="settings-row settings-row--h">
          <span>Fotoğraf göster</span>
          <input type="checkbox" checked={settings.showPhoto} onChange={(e) => setSettings({ showPhoto: e.target.checked })} />
        </label>
        <label className="settings-row">
          <span className="settings-lbl">
            Önizleme zoom <em>{Math.round(settings.zoom * 100)}%</em>
          </span>
          <input
            type="range"
            min={0.4}
            max={1.4}
            step={0.05}
            value={settings.zoom}
            onChange={(e) => setSettings({ zoom: parseFloat(e.target.value) })}
          />
        </label>

        <div className="settings-sect">ATS Kontrol Listesi</div>
        <div className="ats-checks">
          {score.checks.map((c, i) => (
            <div key={i} className={"ats-check" + (c.ok ? " is-ok" : "")}>
              <span className="ats-check__dot">{c.ok ? "✓" : ""}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
