// components/form/Tip.tsx — Genişletilebilir ipucu kutusu
"use client";

import { useState, type ReactNode } from "react";

export default function Tip({ children, label = "İpucu" }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tip">
      <button className="tip__btn" onClick={() => setOpen((o) => !o)} type="button">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {label}
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="tip__body">{children}</div>}
    </div>
  );
}
