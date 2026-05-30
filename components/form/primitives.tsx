// components/form/primitives.tsx — Yeniden kullanılabilir form parçaları
"use client";

import { useState, type ReactNode } from "react";

export function Section({
  icon,
  title,
  count,
  defaultOpen = true,
  children,
}: {
  icon: ReactNode;
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section" data-open={open}>
      <div className="section__hd" onClick={() => setOpen((o) => !o)}>
        <div className="section__title">
          <span className="section__icon">{icon}</span>
          <span>{title}</span>
          {count != null && <span className="section__count">{count}</span>}
        </div>
        <span className="section__chev" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {open && <div className="section__bd">{children}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  );
}
