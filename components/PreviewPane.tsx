// components/PreviewPane.tsx — Sağ panel: araç çubuğu + sayfalı önizleme
"use client";

import { useState } from "react";
import type { CVData, Settings, AtsScore, FontOption, AccentOption } from "@/lib/types";
import { exportPdf } from "@/lib/pdf";
import PaginatedCV from "./cv/PaginatedCV";

function AtsBadge({ score }: { score: AtsScore }) {
  const warn = score.pct < 70;
  return (
    <span className={"ats-badge" + (warn ? " ats-badge--warn" : "")} title={`${score.passed}/${score.total} kontrol geçti`}>
      <span className="pulse" />
      ATS skoru: <b style={{ marginLeft: 2 }}>{score.pct}%</b>
    </span>
  );
}

export default function PreviewPane({
  data,
  settings,
  setSettings,
  score,
  font,
  accent,
  lineHeight,
}: {
  data: CVData;
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  score: AtsScore;
  font: FontOption;
  accent: AccentOption;
  lineHeight: string;
}) {
  const [exporting, setExporting] = useState(false);

  const doExportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportPdf(data, { showPhoto: settings.showPhoto, accent: accent.val });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(
        "PDF oluşturulurken bir hata oluştu: " +
          msg +
          '\n\nYedek: Yazdır diyaloğundan "PDF olarak kaydet" seçeneğini kullanabilirsiniz.'
      );
      window.print();
    } finally {
      setExporting(false);
    }
  };

  const setZoom = (z: number) => setSettings({ zoom: z });

  return (
    <main className="app__preview">
      <div className="preview-toolbar">
        <div className="preview-toolbar__meta">
          <b>Önizleme</b>
          <span>
            · A4 · {font.label.split(" ")[0]} · {accent.label}
          </span>
          <AtsBadge score={score} />
        </div>
        <div className="topbar__actions">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5a6275", marginRight: 8 }}>
            <button className="icon-btn" onClick={() => setZoom(Math.max(0.4, +(settings.zoom - 0.1).toFixed(2)))}>
              −
            </button>
            <span style={{ minWidth: 36, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(settings.zoom * 100)}%
            </span>
            <button className="icon-btn" onClick={() => setZoom(Math.min(1.4, +(settings.zoom + 0.1).toFixed(2)))}>
              +
            </button>
          </div>
          <button className="btn" onClick={() => window.print()} title="Tarayıcı yazdırma diyaloğunu açar">
            Yazdır
          </button>
          <button className="btn btn--primary" onClick={doExportPdf} disabled={exporting}>
            {exporting ? "PDF hazırlanıyor…" : "↓ PDF indir"}
          </button>
        </div>
      </div>
      <div className="preview-stage">
        <PaginatedCV
          data={data}
          options={{ showPhoto: settings.showPhoto, font: font.css, accent: accent.val, lineHeight, zoom: settings.zoom }}
        />
      </div>
    </main>
  );
}
