// hooks/useLocalStorage.ts — SSR-güvenli localStorage durumu
"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // İlk render'da localStorage'tan oku (yalnızca client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* yok say */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Değişimleri kaydet
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* yok say */
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}
