// components/form/HobbiesSection.tsx
"use client";

import { useState } from "react";
import type { CVData } from "@/lib/types";
import { Section } from "./primitives";

const SmileIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export default function HobbiesSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const [draft, setDraft] = useState("");
  const hobbies = data.hobbies ?? [];

  const add = () => {
    const v = draft.trim();
    if (!v || hobbies.includes(v)) return;
    setData({ ...data, hobbies: [...hobbies, v] });
    setDraft("");
  };

  const remove = (i: number) =>
    setData({ ...data, hobbies: hobbies.filter((_, idx) => idx !== i) });

  return (
    <Section icon={<SmileIcon />} title="Hobiler / İlgi Alanları" count={hobbies.length} defaultOpen={false}>
      <div className="field__hint" style={{ margin: "-4px 0 6px" }}>
        Kişiliğinizi yansıtan ilgi alanları ekleyin. Enter&apos;a basın.
      </div>
      <div className="chips" style={{ marginBottom: 8 }}>
        {hobbies.map((h, i) => (
          <span className="chip" key={i}>
            {h}
            <button onClick={() => remove(i)}>×</button>
          </span>
        ))}
        {hobbies.length === 0 && (
          <span style={{ fontSize: 11, color: "#8b91a1", fontStyle: "italic" }}>Henüz eklenmedi.</span>
        )}
      </div>
      <div className="skill-input-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Satranç, Fotoğrafçılık, Trekking…"
        />
        <button className="file-btn" onClick={add}>
          Ekle
        </button>
      </div>
    </Section>
  );
}
