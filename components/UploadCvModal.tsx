// components/UploadCvModal.tsx — "Mevcut CV'mi Güncelle" dialog'u (dosya yükle / metin yapıştır)
"use client";

import { useEffect, useRef, useState } from "react";
import type { CVData } from "@/lib/types";
import { importCvFile, importCvText } from "@/lib/importCv";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M16 16l-4-4-4 4" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);

type Tab = "file" | "text";

export default function UploadCvModal({
  onImported,
  onClose,
  darkMode = false,
}: {
  onImported: (data: CVData, fileName: string) => void;
  onClose: () => void;
  darkMode?: boolean;
}) {
  const [tab, setTab]           = useState<Tab>("file");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [pasted, setPasted]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFile = async (file: File) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await importCvFile(file);
      onImported(data, file.name.replace(/\.[^.]+$/, ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dosya işlenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePastedText = () => {
    setError("");
    try {
      const { data } = importCvText(pasted);
      onImported(data, "Yapıştırılan CV");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Metin işlenirken bir hata oluştu.");
    }
  };

  return (
    <div className="upload-modal" data-dark={darkMode ? "true" : undefined}>
      <div className="upload-modal__backdrop" onClick={onClose} />
      <div className="upload-modal__box">
        <div className="upload-modal__hd">
          <div>
            <div className="upload-modal__title">Mevcut CV&rsquo;nizi Yükleyin</div>
            <p className="upload-modal__desc">
              İletişim bilgileriniz otomatik saptanır; geri kalan metin &ldquo;Hakkımda&rdquo; alanına
              aktarılır. Editörde açıldıktan sonra istediğiniz bölümlere taşıyabilirsiniz.
            </p>
          </div>
          <button className="crop-modal__close" onClick={onClose} aria-label="Kapat">✕</button>
        </div>

        <div className="upload-modal__tabs">
          <button
            className={"upload-modal__tab" + (tab === "file" ? " is-active" : "")}
            onClick={() => setTab("file")}
          >
            Dosya Yükle (PDF / Word)
          </button>
          <button
            className={"upload-modal__tab" + (tab === "text" ? " is-active" : "")}
            onClick={() => setTab("text")}
          >
            Veya Metin Yapıştır
          </button>
        </div>

        {tab === "file" ? (
          <div
            className={"upload-dropzone" + (dragOver ? " is-dragover" : "") + (loading ? " is-loading" : "")}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => !loading && inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            {loading ? (
              <>
                <span className="upload-dropzone__spinner" />
                <p className="upload-dropzone__status">Dosya analiz ediliyor…</p>
              </>
            ) : (
              <>
                <UploadIcon />
                <p className="upload-dropzone__title">
                  Dosyanızı buraya sürükleyin veya <span>seçmek için tıklayın</span>
                </p>
                <p className="upload-dropzone__hint">PDF, Word (.docx) veya metin (.txt) — maks. 10MB</p>
              </>
            )}
          </div>
        ) : (
          <div className="upload-paste">
            <textarea
              className="upload-paste__textarea"
              rows={6}
              placeholder="Özgeçmiş metninizin tamamını kopyalayıp buraya yapıştırın…"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
            />
            <button
              className="btn btn--primary upload-paste__btn"
              onClick={handlePastedText}
              disabled={!pasted.trim()}
            >
              Metni Çözümle &amp; Editöre Aktar
            </button>
          </div>
        )}

        {error && <div className="upload-modal__error">{error}</div>}

        <div className="upload-modal__ft">
          <span className="upload-modal__lock"><LockIcon /> Dosyanız yalnızca tarayıcınızda işlenir</span>
          <button className="btn btn--ghost" onClick={onClose}>Vazgeç</button>
        </div>
      </div>
    </div>
  );
}
