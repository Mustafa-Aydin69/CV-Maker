// components/ShortcutsPanel.tsx — Klavye kısayolları paneli
"use client";

import { useEffect } from "react";

const SHORTCUTS = [
  { keys: ["Ctrl", "Z"],         desc: "Geri al" },
  { keys: ["Ctrl", "Y"],         desc: "Yinele" },
  { keys: ["Ctrl", "Shift", "Z"],desc: "Yinele (alternatif)" },
  { keys: ["?"],                  desc: "Bu paneli aç / kapat" },
  { keys: ["Enter"],              desc: "Yetenek / dil ekle" },
  { keys: ["Esc"],                desc: "Fotoğraf kırpma / modal kapat" },
];

export default function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="shortcuts-modal">
      <div className="shortcuts-modal__backdrop" onClick={onClose} />
      <div className="shortcuts-modal__box">
        <div className="shortcuts-modal__hd">
          <span>Klavye Kısayolları</span>
          <button className="crop-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="shortcuts-modal__list">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="shortcuts-modal__row">
              <div className="shortcuts-modal__keys">
                {s.keys.map((k, j) => (
                  <span key={j}>
                    <kbd className="kbd">{k}</kbd>
                    {j < s.keys.length - 1 && <span className="kbd-plus">+</span>}
                  </span>
                ))}
              </div>
              <span className="shortcuts-modal__desc">{s.desc}</span>
            </div>
          ))}
        </div>
        <p className="shortcuts-modal__foot">
          Sürükle-bırak: Bölüm Düzeni listesinde bölümleri yeniden sırala
        </p>
      </div>
    </div>
  );
}
