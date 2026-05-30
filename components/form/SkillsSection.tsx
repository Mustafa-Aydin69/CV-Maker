// components/form/SkillsSection.tsx
"use client";

import { useState } from "react";
import type { CVData, SkillCategory } from "@/lib/types";
import { Section } from "./primitives";

const FlaskIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10 2v7.31L4.72 17.5A2 2 0 0 0 6.47 21h11.06a2 2 0 0 0 1.75-3.5L14 9.31V2" />
    <line x1="8.5" y1="2" x2="15.5" y2="2" />
    <line x1="6" y1="15" x2="18" y2="15" />
  </svg>
);

function SkillCategoryRow({
  cat,
  onUpdate,
  onRemove,
}: {
  cat: SkillCategory;
  onUpdate: (patch: Partial<SkillCategory>) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState("");
  const addSkill = () => {
    const v = draft.trim();
    if (!v) return;
    onUpdate({ items: [...cat.items, v] });
    setDraft("");
  };
  const removeSkill = (i: number) => onUpdate({ items: cat.items.filter((_, idx) => idx !== i) });

  return (
    <div className="skill-cat">
      <div className="skill-cat__head">
        <input
          className="skill-cat__name"
          value={cat.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Kategori adı"
        />
        <button className="icon-btn icon-btn--danger" onClick={onRemove} title="Kategoriyi sil">
          ✕
        </button>
      </div>
      <div className="chips">
        {cat.items.map((it, i) => (
          <span className="chip" key={i}>
            {it}
            <button onClick={() => removeSkill(i)}>×</button>
          </span>
        ))}
        {cat.items.length === 0 && (
          <span style={{ fontSize: 11, color: "#8b91a1", fontStyle: "italic" }}>Henüz yetenek eklenmedi.</span>
        )}
      </div>
      <div className="skill-input-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Yetenek yaz, Enter…"
        />
        <button className="file-btn" onClick={addSkill}>
          Ekle
        </button>
      </div>
    </div>
  );
}

export default function SkillsSection({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const cats = data.skills;
  const setCats = (v: SkillCategory[]) => setData({ ...data, skills: v });
  const updateCat = (idx: number, patch: Partial<SkillCategory>) =>
    setCats(cats.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const addCat = () => setCats([...cats, { name: "Yeni kategori", items: [], _id: Date.now() }]);
  const removeCat = (idx: number) => setCats(cats.filter((_, i) => i !== idx));
  const totalCount = cats.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <Section icon={<FlaskIcon />} title="Yetenekler (Anahtar Kelimeler)" count={totalCount}>
      <div className="field__hint" style={{ margin: "-4px 0 4px" }}>
        Kategorilere göre gruplayın (örn. Programlama, Frameworks, Araçlar). Yetkinliği ekledikten sonra Enter&apos;a basın.
      </div>
      <div className="skills-input">
        {cats.map((cat, i) => (
          <SkillCategoryRow
            key={cat._id ?? i}
            cat={cat}
            onUpdate={(patch) => updateCat(i, patch)}
            onRemove={() => removeCat(i)}
          />
        ))}
      </div>
      <button className="add-btn" onClick={addCat}>
        + Kategori ekle
      </button>
    </Section>
  );
}
