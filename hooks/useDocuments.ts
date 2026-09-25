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
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const loaded = loadState();
    stateRef.current = loaded;
    setState(loaded);
  }, []);

  // Her mutasyon localStorage'a hemen (senkron) yazılır — bir sonraki route'a
  // geçmeden önce (örn. giriş sayfasından /editor'a) verinin kalıcı olduğundan
  // emin olmak için; ayrı bir "kaydet" efektine güvenmek geçiş anında yarış
  // durumuna (race condition) yol açabilir.
  const mutate = useCallback((updater: (prev: DocsState) => DocsState) => {
    const next = updater(stateRef.current);
    stateRef.current = next;
    saveState(next);
    setState(next);
    return next;
  }, []);

  const activeDoc = state.docs.find((d) => d.id === state.activeId) ?? state.docs[0];
  const activeData: CVData = activeDoc?.data ?? DEFAULT_DATA;

  const setActiveData = useCallback((data: CVData) => {
    mutate((prev) => ({
      ...prev,
      docs: prev.docs.map((d) =>
        d.id === prev.activeId ? { ...d, data, updatedAt: Date.now() } : d
      ),
    }));
  }, [mutate]);

  const switchDoc = useCallback((id: string) => {
    mutate((prev) => ({ ...prev, activeId: id }));
  }, [mutate]);

  const createDoc = useCallback((initialData?: CVData, name?: string) => {
    const doc = newDoc(name ?? `CV ${stateRef.current.docs.length + 1}`, initialData ?? DEFAULT_DATA);
    mutate((prev) => ({ docs: [...prev.docs, doc], activeId: doc.id }));
    return doc.id;
  }, [mutate]);

  const duplicateDoc = useCallback(() => {
    mutate((prev) => {
      const src = prev.docs.find((d) => d.id === prev.activeId);
      if (!src) return prev;
      const copy = newDoc(src.name + " (kopya)", JSON.parse(JSON.stringify(src.data)));
      return { docs: [...prev.docs, copy], activeId: copy.id };
    });
  }, [mutate]);

  const deleteDoc = useCallback((id: string) => {
    mutate((prev) => {
      if (prev.docs.length <= 1) return prev;
      const docs = prev.docs.filter((d) => d.id !== id);
      const activeId = prev.activeId === id
        ? docs[docs.length - 1].id
        : prev.activeId;
      return { docs, activeId };
    });
  }, [mutate]);

  const renameDoc = useCallback((id: string, name: string) => {
    mutate((prev) => ({
      ...prev,
      docs: prev.docs.map((d) => d.id === id ? { ...d, name: name || d.name } : d),
    }));
  }, [mutate]);

  return {
    docs: state.docs,
    activeId: state.activeId,
    activeDoc,
    activeData,
    lastSavedAt: activeDoc?.updatedAt ?? 0,
    setActiveData,
    switchDoc,
    createDoc,
    duplicateDoc,
    deleteDoc,
    renameDoc,
  };
}
