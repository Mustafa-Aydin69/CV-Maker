// components/form/ListSection.tsx — Genel ekle/sil/sırala listesi
"use client";

import type { ReactNode } from "react";
import { Section } from "./primitives";

export interface HasId {
  _id: number;
}

export default function ListSection<T extends HasId>({
  icon,
  title,
  items,
  setItems,
  factory,
  render,
  addLabel,
}: {
  icon: ReactNode;
  title: string;
  items: T[];
  setItems: (v: T[]) => void;
  factory: () => Omit<T, "_id">;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
}) {
  const add = () => setItems([...items, { ...(factory() as T), _id: Date.now() + Math.random() }]);
  const remove = (id: number) => setItems(items.filter((i) => i._id !== id));
  const update = (id: number, patch: Partial<T>) =>
    setItems(items.map((i) => (i._id === id ? { ...i, ...patch } : i)));
  const move = (id: number, dir: number) => {
    const idx = items.findIndex((i) => i._id === id);
    const ni = idx + dir;
    if (ni < 0 || ni >= items.length) return;
    const out = [...items];
    [out[idx], out[ni]] = [out[ni], out[idx]];
    setItems(out);
  };

  return (
    <Section icon={icon} title={title} count={items.length}>
      {items.length === 0 && <div className="empty-hint">Henüz eklenmedi.</div>}
      {items.map((item, i) => (
        <div className="item-card" key={item._id}>
          <div className="item-card__head">
            <span className="item-card__num">#{i + 1}</span>
            <div className="item-card__actions">
              <button className="icon-btn" title="Yukarı" disabled={i === 0} onClick={() => move(item._id, -1)}>
                ↑
              </button>
              <button
                className="icon-btn"
                title="Aşağı"
                disabled={i === items.length - 1}
                onClick={() => move(item._id, 1)}
              >
                ↓
              </button>
              <button className="icon-btn icon-btn--danger" title="Sil" onClick={() => remove(item._id)}>
                ✕
              </button>
            </div>
          </div>
          {render(item, (patch) => update(item._id, patch))}
        </div>
      ))}
      <button className="add-btn" onClick={add}>
        + {addLabel}
      </button>
    </Section>
  );
}
