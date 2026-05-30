// components/form/LanguagesSection.tsx
"use client";

import { useState } from "react";
import type { CVData } from "@/lib/types";
import { Section } from "./primitives";

const LanguagesIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 8l6 6" />
    <path d="M4 14l6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2v3" />
    <path d="M22 22l-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

export default function LanguagesSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const [draft, setDraft] = useState("");
  const langs = data.languages ?? [];

  const addLang = () => {
    const v = draft.trim();
    if (!v || langs.includes(v)) return;
    setData({ ...data, languages: [...langs, v] });
    setDraft("");
  };

  const removeLang = (i: number) =>
    setData({ ...data, languages: langs.filter((_, idx) => idx !== i) });

  return (
    <Section icon={<LanguagesIcon />} title="Yabancı Diller" count={langs.length}>
      <div className="field__hint" style={{ margin: "-4px 0 6px" }}>
        Dil ve seviyesini girin (örn. İngilizce (C1)). Enter&apos;a basın.
      </div>
      <div className="chips" style={{ marginBottom: 8 }}>
        {langs.map((l, i) => (
          <span className="chip" key={i}>
            {l}
            <button onClick={() => removeLang(i)}>×</button>
          </span>
        ))}
        {langs.length === 0 && (
          <span style={{ fontSize: 11, color: "#8b91a1", fontStyle: "italic" }}>Henüz dil eklenmedi.</span>
        )}
      </div>
      <div className="skill-input-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLang();
            }
          }}
          placeholder="İngilizce (C1), Almanca (B2)…"
        />
        <button className="file-btn" onClick={addLang}>
          Ekle
        </button>
      </div>
    </Section>
  );
}
