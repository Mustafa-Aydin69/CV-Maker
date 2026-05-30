// hooks/useHistory.ts — Geri al / Yinele (undo/redo) stack
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX = 40;

interface HistState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(
  externalValue: T,
  onChange: (v: T) => void,
  resetSignal: string,
) {
  const [hist, setHist] = useState<HistState<T>>({
    past: [],
    present: externalValue,
    future: [],
  });

  const prevSignal = useRef(resetSignal);
  const prevExternal = useRef(externalValue);
  const suppressSync = useRef(false);

  // Belge değişince geçmişi sıfırla
  useEffect(() => {
    if (prevSignal.current !== resetSignal) {
      prevSignal.current = resetSignal;
      prevExternal.current = externalValue;
      setHist({ past: [], present: externalValue, future: [] });
    }
  });

  // Dışarıdan gelen değer değişince (setActiveData) geçmişi güncelle
  useEffect(() => {
    if (!suppressSync.current && prevExternal.current !== externalValue) {
      prevExternal.current = externalValue;
      setHist((h) => ({ ...h, present: externalValue }));
    }
    suppressSync.current = false;
  });

  const setData = useCallback((v: T) => {
    suppressSync.current = true;
    prevExternal.current = v;
    onChange(v);
    setHist(({ past, present }) => ({
      past: [...past.slice(-(MAX - 1)), present],
      present: v,
      future: [],
    }));
  }, [onChange]);

  const undo = useCallback(() => {
    setHist(({ past, present, future }) => {
      if (!past.length) return { past, present, future };
      const prev = past[past.length - 1];
      suppressSync.current = true;
      prevExternal.current = prev;
      onChange(prev);
      return {
        past: past.slice(0, -1),
        present: prev,
        future: [present, ...future.slice(0, MAX - 1)],
      };
    });
  }, [onChange]);

  const redo = useCallback(() => {
    setHist(({ past, present, future }) => {
      if (!future.length) return { past, present, future };
      const next = future[0];
      suppressSync.current = true;
      prevExternal.current = next;
      onChange(next);
      return {
        past: [...past.slice(-(MAX - 1)), present],
        present: next,
        future: future.slice(1),
      };
    });
  }, [onChange]);

  return {
    data: hist.present,
    setData,
    undo,
    redo,
    canUndo: hist.past.length > 0,
    canRedo: hist.future.length > 0,
  };
}
