// components/form/CustomSectionsPanel.tsx — Kullanıcı tanımlı özel bölümler
"use client";

import type { CVData, CustomSection } from "@/lib/types";
import { Section, Field } from "./primitives";

const PuzzleIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

function CustomSectionCard({
  item,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  item: CustomSection;
  index: number;
  total: number;
  onUpdate: (patch: Partial<CustomSection>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="item-card">
      <div className="item-card__head">
        <span className="item-card__num">#{index + 1}</span>
        <div className="item-card__actions">
          <button className="icon-btn" disabled={index === 0}        onClick={() => onMove(-1)} title="Yukarı">↑</button>
          <button className="icon-btn" disabled={index === total - 1} onClick={() => onMove(1)}  title="Aşağı">↓</button>
          <button className="icon-btn icon-btn--danger" onClick={onRemove} title="Sil">✕</button>
        </div>
      </div>
      <Field label="Bölüm başlığı">
        <input
          type="text"
          value={item.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Yayınlar, Konferanslar, Ekstra Kurslar…"
        />
      </Field>
      <Field label="İçerik" hint="Her satır ayrı madde olarak gösterilir.">
        <textarea
          value={item.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={4}
          placeholder={"Smith, J. & Demir, A. (2023). Makale başlığı. Dergi Adı.\nBest Paper Award — IEEE Conference 2022"}
        />
      </Field>
    </div>
  );
}

export default function CustomSectionsPanel({ data, setData }: { data: CVData; setData: (d: CVData) => void }) {
  const items = data.customSections ?? [];

  const add = () =>
    setData({ ...data, customSections: [...items, { _id: Date.now(), title: "Özel Bölüm", content: "" }] });

  const update = (idx: number, patch: Partial<CustomSection>) =>
    setData({ ...data, customSections: items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) });

  const remove = (idx: number) =>
    setData({ ...data, customSections: items.filter((_, i) => i !== idx) });

  const move = (idx: number, dir: -1 | 1) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= items.length) return;
    const next = [...items];
    [next[idx], next[ni]] = [next[ni], next[idx]];
    setData({ ...data, customSections: next });
  };

  return (
    <Section icon={<PuzzleIcon />} title="Özel Bölümler" count={items.length} defaultOpen={false}>
      <div className="field__hint" style={{ margin: "-4px 0 8px" }}>
        İstediğiniz başlık ve içerikle bölüm ekleyin — CV&apos;nin en sonuna eklenir.
      </div>
      {items.map((it, i) => (
        <CustomSectionCard
          key={it._id}
          item={it}
          index={i}
          total={items.length}
          onUpdate={(p) => update(i, p)}
          onRemove={() => remove(i)}
          onMove={(d) => move(i, d)}
        />
      ))}
      <button className="add-btn" onClick={add}>+ Özel bölüm ekle</button>
    </Section>
  );
}
