// hooks/useDocuments.ts — Çoklu CV belgesi yönetimi
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CVData } from "@/lib/types";
import { DEFAULT_DATA, STORAGE_KEY } from "@/lib/defaultData";

const DOCS_KEY = "cv-maker-docs-v1";

export interface CVDocument {
  id: string;
  name: string;
  data: CVData;
  updatedAt: number;
}

interface DocsState {
  docs: CVDocument[];
  activeId: string;
}

function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function newDoc(name: string, data: CVData): CVDocument {
  return { id: makeId(), name, data, updatedAt: Date.now() };
}

function loadState(): DocsState {
  if (typeof window === "undefined") {
    const doc = newDoc("CV 1", DEFAULT_DATA);
    return { docs: [doc], activeId: doc.id };
  }

  // Yeni format
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DocsState;
      if (Array.isArray(parsed.docs) && parsed.docs.length) return parsed;
    }
  } catch { /* ignore */ }

  // Eski tek-CV formatından geç
  try {
    const oldRaw = localStorage.getItem(STORAGE_KEY);
    if (oldRaw) {
      const oldData: CVData = { ...DEFAULT_DATA, ...JSON.parse(oldRaw) };
      const doc = newDoc("CV 1", oldData);
      return { docs: [doc], activeId: doc.id };
    }
  } catch { /* ignore */ }

  const doc = newDoc("CV 1", DEFAULT_DATA);
  return { docs: [doc], activeId: doc.id };
}

function saveState(state: DocsState) {
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useDocuments() {
  const [state, setState] = useState<DocsState>(() => ({
    docs: [],
    activeId: "",
  }));
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const activeDoc = state.docs.find((d) => d.id === state.activeId) ?? state.docs[0];
  const activeData: CVData = activeDoc?.data ?? DEFAULT_DATA;

  const setActiveData = useCallback((data: CVData) => {
    setState((prev) => ({
      ...prev,
      docs: prev.docs.map((d) =>
        d.id === prev.activeId ? { ...d, data, updatedAt: Date.now() } : d
      ),
    }));
  }, []);

  const switchDoc = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeId: id }));
  }, []);

  const createDoc = useCallback(() => {
    const doc = newDoc(`CV ${stateRef.current.docs.length + 1}`, DEFAULT_DATA);
    setState((prev) => ({ docs: [...prev.docs, doc], activeId: doc.id }));
    return doc.id;
  }, []);

  const duplicateDoc = useCallback(() => {
    setState((prev) => {
      const src = prev.docs.find((d) => d.id === prev.activeId);
      if (!src) return prev;
      const copy = newDoc(src.name + " (kopya)", JSON.parse(JSON.stringify(src.data)));
      return { docs: [...prev.docs, copy], activeId: copy.id };
    });
  }, []);

  const deleteDoc = useCallback((id: string) => {
    setState((prev) => {
      if (prev.docs.length <= 1) return prev;
      const docs = prev.docs.filter((d) => d.id !== id);
      const activeId = prev.activeId === id
        ? docs[docs.length - 1].id
        : prev.activeId;
      return { docs, activeId };
    });
  }, []);

  const renameDoc = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      docs: prev.docs.map((d) => d.id === id ? { ...d, name: name || d.name } : d),
    }));
  }, []);

  return {
    docs: state.docs,
    activeId: state.activeId,
    activeDoc,
    activeData,
    setActiveData,
    switchDoc,
    createDoc,
    duplicateDoc,
    deleteDoc,
    renameDoc,
  };
}
