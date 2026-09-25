// app/page.tsx — Giriş (karşılama) sayfası — "/"
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CVData, Settings } from "@/lib/types";
import { DEFAULT_SETTINGS, SETTINGS_KEY, EMPTY_DATA, DEFAULT_DATA } from "@/lib/defaultData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDocuments } from "@/hooks/useDocuments";
import Landing from "@/components/Landing";
import UploadCvModal from "@/components/UploadCvModal";

export default function LandingPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const docsMgr = useDocuments();
  const [settings] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  return (
    <>
      <Landing
        darkMode={settings.darkMode}
        onStartFresh={() => {
          docsMgr.createDoc(EMPTY_DATA, `CV ${docsMgr.docs.length + 1}`);
          router.push("/editor");
        }}
        onOpenUpload={() => setUploadOpen(true)}
        onLoadSample={() => {
          docsMgr.createDoc(DEFAULT_DATA, `CV ${docsMgr.docs.length + 1}`);
          router.push("/editor");
        }}
      />
      {uploadOpen && (
        <UploadCvModal
          darkMode={settings.darkMode}
          onClose={() => setUploadOpen(false)}
          onImported={(imported: CVData, fileName: string) => {
            docsMgr.createDoc(imported, fileName || `CV ${docsMgr.docs.length + 1}`);
            setUploadOpen(false);
            router.push("/editor");
          }}
        />
      )}
    </>
  );
}
