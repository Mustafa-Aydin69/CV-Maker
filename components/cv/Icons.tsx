// components/cv/Icons.tsx — İletişim ikonları (line-style, currentColor)
import type { ReactNode } from "react";

export const ICON: Record<string, ReactNode> = {
  address: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h3l2 5-2 1c1 2.5 3 4.5 5.5 5.5l1-2 5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8h4.56v14H.22V8Zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.33-2.36 4.63 0 5.48 3.05 5.48 7.02V22h-4.56v-6.2c0-1.48-.03-3.39-2.07-3.39-2.07 0-2.39 1.61-2.39 3.28V22H7.72V8Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.16.08 1.76 1.2 1.76 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.3-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.08-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.6.24 2.76.12 3.06.74.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.15v3.19c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
};
