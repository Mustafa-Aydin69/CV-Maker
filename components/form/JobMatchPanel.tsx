// components/form/JobMatchPanel.tsx — Akıllı iş ilanı eşleştirme paneli
"use client";

import { useState, useCallback } from "react";
import type { CVData } from "@/lib/types";
import { Section } from "./primitives";
import { analyzeJobMatch } from "@/lib/jobmatch/index";
import type { JobMatchResult, UserAnswers, UserAnswerValue } from "@/lib/jobmatch/types";
import { MIN_JOB_TEXT_LENGTH, MAX_JOB_TEXT_LENGTH } from "@/lib/jobmatch/constants";

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const STATUS_LABELS: Record<string, string> = {
  matched:          "Eşleşti",
  partial_match:    "Kısmi",
  not_mentioned:    "Belirtilmemiş",
  confirmed_missing:"Eksik",
  not_applicable:   "Geçersiz",
};

const STATUS_CLASSES: Record<string, string> = {
  matched:          "jm2-badge jm2-badge--match",
  partial_match:    "jm2-badge jm2-badge--partial",
  not_mentioned:    "jm2-badge jm2-badge--nm",
  confirmed_missing:"jm2-badge jm2-badge--miss",
  not_applicable:   "jm2-badge jm2-badge--na",
};

const LEVEL_LABELS: Record<string, string> = {
  mandatory: "Zorunlu",
  preferred: "Tercih",
  contextual: "Bağlam",
};

function scoreColor(score: number): string {
  if (score >= 70) return "#1f7a44";
  if (score >= 45) return "#8a5a14";
  return "#c4322a";
}

type GroupKey = "matched" | "partial" | "notMentioned" | "missing" | "suggestions";

export default function JobMatchPanel({ data }: { data: CVData }) {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [stale, setStale] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<GroupKey>>(new Set(["matched", "partial", "missing"]));

  const handleAnalyze = useCallback(() => {
    const r = analyzeJobMatch(data, jobText, userAnswers);
    setResult(r);
    setStale(false);
  }, [data, jobText, userAnswers]);

  const handleAnswer = (reqId: string, val: UserAnswerValue) => {
    const next = { ...userAnswers, [reqId]: val };
    setUserAnswers(next);
    if (result) {
      const r = analyzeJobMatch(data, jobText, next);
      setResult(r);
      setStale(false);
    }
  };

  const handleTextChange = (v: string) => {
    setJobText(v);
    if (result) setStale(true);
  };

  const toggleGroup = (key: GroupKey) => {
    setOpenGroups((prev) => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  const tooShort = jobText.trim().length > 0 && jobText.trim().length < MIN_JOB_TEXT_LENGTH;
  const tooLong  = jobText.length > MAX_JOB_TEXT_LENGTH;
  const sc = result ? scoreColor(result.summary.score) : "#9aa0ad";

  return (
    <Section icon={<TargetIcon />} title="İş İlanı Eşleştirme" defaultOpen={false}>
      <div className="field__hint" style={{ margin: "-4px 0 8px" }}>
        İş ilanı metnini yapıştırın — CV&apos;nizdeki kriterlerin ilanla örtüşmesi analiz edilir.
      </div>

      <textarea
        className="jm-textarea"
        value={jobText}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Aranan pozisyonun iş ilanını buraya yapıştırın…"
        rows={5}
      />

      {tooShort && <p className="jm2-warn">İlan metni çok kısa ({jobText.trim().length} karakter). En az {MIN_JOB_TEXT_LENGTH} karakter gerekli.</p>}
      {tooLong  && <p className="jm2-warn">İlan metni çok uzun. İlk {MAX_JOB_TEXT_LENGTH} karakter analiz edilecek.</p>}

      <button
        className="jm2-btn"
        onClick={handleAnalyze}
        disabled={jobText.trim().length < MIN_JOB_TEXT_LENGTH}
      >
        İlanı Analiz Et
      </button>

      {result && (
        <div className="jm2-result">
          {stale && <div className="jm2-stale">İlan veya CV değişti — yeniden analiz edin.</div>}

          {/* Özet kart */}
          <div className="jm2-summary">
            <div className="jm2-summary__scores">
              <div className="jm2-big-score" style={{ color: sc }}>{result.summary.score}%</div>
              <div className="jm2-score-labels">
                <span style={{ color: sc, fontWeight: 700 }}>CV Uyumu</span>
                <span className="jm2-conf">Güven: %{result.summary.confidence}</span>
              </div>
            </div>
            <div className="jm2-score-bar">
              <div className="jm2-score-bar__fill" style={{ width: `${result.summary.score}%`, background: sc }} />
            </div>
            <div className="jm2-stat-row">
              <span className="jm2-stat jm2-stat--match">✓ {result.summary.matchedCount} eşleşti</span>
              <span className="jm2-stat jm2-stat--partial">~ {result.summary.partialCount} kısmi</span>
              <span className="jm2-stat jm2-stat--nm">? {result.summary.notMentionedCount} belirtilmemiş</span>
              {result.summary.missingCount > 0 &&
                <span className="jm2-stat jm2-stat--miss">✗ {result.summary.missingCount} eksik</span>}
            </div>
            <div className="jm2-jobtype">
              {result.jobType === "internship" ? "Staj ilanı" : "Tam zamanlı ilan"} olarak değerlendirildi.
            </div>
          </div>

          {/* Bilgi tamamlama */}
          {(() => {
            const askable = result.matches.filter(
              (m) => m.status === "not_mentioned" && !userAnswers[m.requirementId]
            ).slice(0, 5);
            if (askable.length === 0) return null;
            return (
              <div className="jm2-qa-section">
                <div className="jm2-qa-title">Bilgi Tamamlama</div>
                <p className="jm2-qa-desc">CV&apos;nizde bulunmayan bazı kriterler için yanıt verirseniz uyum skoru netleşir:</p>
                {askable.map((m) => (
                  <div key={m.requirementId} className="jm2-qa-item">
                    <span className="jm2-qa-label">{m.label}</span>
                    <div className="jm2-qa-btns">
                      <button onClick={() => handleAnswer(m.requirementId, "yes")}     className="jm2-qa-btn jm2-qa-btn--yes">Evet</button>
                      <button onClick={() => handleAnswer(m.requirementId, "no")}      className="jm2-qa-btn jm2-qa-btn--no">Hayır</button>
                      <button onClick={() => handleAnswer(m.requirementId, "unknown")} className="jm2-qa-btn">Bilmiyorum</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Kriter grupları */}
          {([
            ["matched",     "Eşleşen Kriterler",      result.matches.filter((m) => m.status === "matched")],
            ["partial",     "Kısmi Eşleşmeler",       result.matches.filter((m) => m.status === "partial_match")],
            ["notMentioned","CV’de Belirtilmemişler", result.matches.filter((m) => m.status === "not_mentioned")],
            ["missing",     "Eksik / Karşılanamayan", result.matches.filter((m) => m.status === "confirmed_missing")],
          ] as Array<[GroupKey, string, typeof result.matches]>).map(([key, label, items]) => {
            if (items.length === 0) return null;
            const open = openGroups.has(key);
            return (
              <div key={key} className="jm2-group">
                <button className="jm2-group__hd" onClick={() => toggleGroup(key)}>
                  <span className={`jm2-group__dot jm2-group__dot--${key}`} />
                  <span>{label} ({items.length})</span>
                  <span className="jm2-group__chev">{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div className="jm2-group__body">
                    {items.map((m) => (
                      <div key={m.requirementId} className="jm2-card">
                        <div className="jm2-card__row">
                          <span className="jm2-card__label">{m.label}</span>
                          <span className={STATUS_CLASSES[m.status]}>{STATUS_LABELS[m.status]}</span>
                          <span className="jm2-card__level">{LEVEL_LABELS[m.level]}</span>
                        </div>
                        {m.evidence.length > 0 && (
                          <div className="jm2-card__evidence">
                            Kanıt: <em>&ldquo;{m.evidence[0].text.slice(0, 80)}{m.evidence[0].text.length > 80 ? "…" : ""}&rdquo;</em>
                          </div>
                        )}
                        <div className="jm2-card__explanation">{m.explanation}</div>
                        {m.improvementSuggestion && (
                          <div className="jm2-card__suggestion">💡 {m.improvementSuggestion}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Genel öneriler */}
          {result.suggestions.length > 0 && (
            <div className="jm2-group">
              <button className="jm2-group__hd" onClick={() => toggleGroup("suggestions")}>
                <span className="jm2-group__dot jm2-group__dot--suggestions" />
                <span>CV Geliştirme Önerileri ({result.suggestions.length})</span>
                <span className="jm2-group__chev">{openGroups.has("suggestions") ? "▲" : "▼"}</span>
              </button>
              {openGroups.has("suggestions") && (
                <div className="jm2-group__body">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="jm2-suggestion-item">💡 {s}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
