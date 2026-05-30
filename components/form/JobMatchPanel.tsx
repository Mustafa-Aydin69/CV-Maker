// components/form/JobMatchPanel.tsx — İş ilanı anahtar kelime eşleştirme paneli
"use client";

import { useState, useMemo } from "react";
import type { CVData } from "@/lib/types";
import { Section } from "./primitives";
import { matchKeywords, extractCvText } from "@/lib/keywords";

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const MAX_SHOWN = 18;

export default function JobMatchPanel({ data }: { data: CVData }) {
  const [jobText, setJobText] = useState("");

  const cvText = useMemo(() => extractCvText(data), [data]);

  const result = useMemo(() => {
    if (!jobText.trim()) return null;
    return matchKeywords(cvText, jobText);
  }, [cvText, jobText]);

  const scoreColor =
    !result ? "#9aa0ad"
    : result.score >= 70 ? "#1f7a44"
    : result.score >= 40 ? "#8a5a14"
    : "#c4322a";

  return (
    <Section icon={<TargetIcon />} title="İş İlanı Eşleştirme" defaultOpen={false}>
      <div className="field__hint" style={{ margin: "-4px 0 8px" }}>
        İş ilanı metnini yapıştırın — CV&apos;nizdeki eksik anahtar kelimeler gösterilir.
      </div>

      <textarea
        className="jm-textarea"
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        placeholder="Aranan pozisyonun iş ilanını buraya yapıştırın…"
        rows={5}
      />

      {result && (
        <div className="jm-result">
          {/* Skor */}
          <div className="jm-score-row">
            <div className="jm-score" style={{ color: scoreColor }}>
              {result.score}%
            </div>
            <div className="jm-score-info">
              <span style={{ fontWeight: 700, color: scoreColor }}>Eşleşme</span>
              <span style={{ color: "#8b91a1", fontSize: 11 }}>
                {result.matched.length} / {result.matched.length + result.missing.length} anahtar kelime
              </span>
            </div>
            <div className="jm-score-bar">
              <div
                className="jm-score-bar__fill"
                style={{ width: `${result.score}%`, background: scoreColor }}
              />
            </div>
          </div>

          {/* Eksik kelimeler */}
          {result.missing.length > 0 && (
            <div className="jm-group">
              <div className="jm-group__label jm-group__label--miss">
                Eksik anahtar kelimeler ({result.missing.length})
              </div>
              <div className="chips">
                {result.missing.slice(0, MAX_SHOWN).map((kw, i) => (
                  <span key={i} className="chip chip--miss">{kw}</span>
                ))}
                {result.missing.length > MAX_SHOWN && (
                  <span className="jm-more">+{result.missing.length - MAX_SHOWN} daha</span>
                )}
              </div>
            </div>
          )}

          {/* Eşleşen kelimeler */}
          {result.matched.length > 0 && (
            <div className="jm-group">
              <div className="jm-group__label jm-group__label--match">
                Eşleşen kelimeler ({result.matched.length})
              </div>
              <div className="chips">
                {result.matched.slice(0, MAX_SHOWN).map((kw, i) => (
                  <span key={i} className="chip chip--match">{kw}</span>
                ))}
                {result.matched.length > MAX_SHOWN && (
                  <span className="jm-more">+{result.matched.length - MAX_SHOWN} daha</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
