// components/Landing.tsx — Karşılama (giriş) ekranı — editoryal / Swiss stil
"use client";

const FilePlusIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="12" x2="12" y2="18" /><line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 16l-4-4-4 4" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);
const FileCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><polyline points="9 14 11 16 15 12" />
  </svg>
);
const LayersIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WHY_ITEMS = [
  {
    n: "01",
    title: "Doğrusal Okuma Akışı",
    body: "İki sütunlu veya kenar çubuklu CV'ler ATS yazılımlarında satır atlama ve bölüm çakışmalarına yol açar. Tek sütun hata payını sıfırlar.",
  },
  {
    n: "02",
    title: "Yıldız ve Bar İllüzyonu Yok",
    body: "“İngilizce: 4/5 yıldız” gibi grafiksel göstergeler işe alımcılar için anlamsızdır. Beceriler somut proje ve kelimelerle ifade edilir.",
  },
  {
    n: "03",
    title: "Uluslararası Standart",
    body: "Önde gelen şirketlerin ve üniversitelerin benimsediği, kanıtlanmış minimalist tipografi standartlarıyla eşleşir.",
  },
];

export default function Landing({
  onStartFresh,
  onOpenUpload,
  onLoadSample,
  darkMode,
}: {
  onStartFresh: () => void;
  onOpenUpload: () => void;
  onLoadSample: () => void;
  darkMode: boolean;
}) {
  return (
    <div className="landing" data-dark={darkMode ? "true" : undefined}>
      {/* Duyuru şeridi */}
      <div className="landing__strip">
        <span className="landing__dot" />
        Yazılım filtrelerini (ATS) yanıltmayan standart tek sütun tipografi
        <span className="landing__strip-sep">•</span>
        <span className="landing__strip-sub">İK uzmanlarının 6 saniyelik ilk taramasına uygun</span>
      </div>

      {/* Header */}
      <header className="landing__header">
        <div className="landing__brand">
          <span className="landing__logo">Cv</span>
          <div>
            <div className="landing__brand-row">
              <span className="landing__brand-name">CV Studio</span>
              <span className="landing__brand-badge">ATS STANDARD</span>
            </div>
            <div className="landing__brand-tag">Sade, Taranabilir ve Profesyonel</div>
          </div>
        </div>
        <div className="landing__header-actions">
          <button className="landing__header-btn" onClick={onOpenUpload}>
            <UploadIcon /> CV Yükle
          </button>
          <button className="landing__header-btn landing__header-btn--dark" onClick={onStartFresh}>
            Sıfırdan Başla <ArrowRightIcon />
          </button>
        </div>
      </header>

      <main className="landing__main">
        <div className="landing__hero">
          {/* Sol: metin + kartlar */}
          <div className="landing__hero-left">
            <div className="landing__badge">
              <ShieldIcon /> %100 Taranabilir Harvard Standardı
            </div>

            <h1 className="landing__title">
              Gösterişe değil,{" "}
              <em>kariyerinize odaklanan</em> sade bir özgeçmiş.
            </h1>

            <p className="landing__subtitle">
              Grafikler, karmaşık renk şemaları ve çok sütunlu tablolar kurumsal şirketlerin kullandığı
              filtreleme algoritmalarında (ATS) kaybolur. İhtiyacınız olan şey, tecrübenizi berrak bir
              hiyerarşiyle öne çıkaran net bir taslaktır.
            </p>

            <div className="landing__cards">
              <button className="landing__card" onClick={onStartFresh}>
                <span className="landing__card-icon">
                  <FilePlusIcon />
                </span>
                <span className="landing__card-title">Sıfırdan CV Oluştur</span>
                <span className="landing__card-desc">
                  Ön tanımlı kurumsal standartta boş bir sayfa açın. Adım adım bilgilerinizi doldurun.
                </span>
                <span className="landing__card-cta">
                  Temiz şablonu aç <ArrowRightIcon />
                </span>
              </button>

              <button className="landing__card landing__card--dark" onClick={onOpenUpload}>
                <span className="landing__card-icon landing__card-icon--dark">
                  <SparklesIcon />
                </span>
                <span className="landing__card-title">
                  Mevcut CV&rsquo;mi Güncelle
                  <span className="landing__card-badge">İÇE AKTAR</span>
                </span>
                <span className="landing__card-desc">
                  Var olan PDF veya metin özgeçmişinizi yükleyin. İçerikleri editöre aktarıp hemen düzenleyin.
                </span>
                <span className="landing__card-cta">
                  Dosya yükle / düzenle <UploadIcon />
                </span>
              </button>
            </div>

            <div className="landing__trust">
              <span><LockIcon /> Verileriniz tarayıcınızda kalır</span>
              <span><FileCheckIcon /> Standart A4 baskı çıktısı</span>
              <span><LayersIcon /> Kayıt veya üyelik gerekmez</span>
            </div>
          </div>

          {/* Sağ: gerçek kağıt hissi veren mini önizleme */}
          <div className="landing__paper-wrap">
            <div className="landing__paper-shadow" />
            <div className="landing__paper">
              <div className="landing__paper-hd">
                <div className="landing__paper-name">Ayşe Demir</div>
                <div className="landing__paper-role">Senior Frontend Developer</div>
                <div className="landing__paper-contact">
                  İstanbul <span>•</span> ayse.demir@ornek.com <span>•</span> github.com/aysedemir
                </div>
              </div>
              <div className="landing__paper-sec">
                <div className="landing__paper-sec-hd">İş Deneyimi</div>
                <div className="landing__paper-row">
                  <span>Trendyol — Senior Developer</span>
                  <span className="landing__paper-dim">2022 — Günümüz</span>
                </div>
                <p className="landing__paper-line">
                  • React/TypeScript ile ürün sayfasını yeniden yazdı; LCP süresini 3.8s&rsquo;den 1.4s&rsquo;e düşürdü.
                </p>
              </div>
              <div className="landing__paper-sec">
                <div className="landing__paper-sec-hd">Eğitim</div>
                <div className="landing__paper-row">
                  <span>Boğaziçi Üniversitesi</span>
                  <span className="landing__paper-dim">2015 — 2019</span>
                </div>
                <div className="landing__paper-dim">Bilgisayar Mühendisliği — Lisans</div>
              </div>
              <div className="landing__paper-sec">
                <div className="landing__paper-sec-hd">Yetenekler</div>
                <div className="landing__paper-dim">React, Next.js, TypeScript, Node.js</div>
              </div>
              <div className="landing__paper-ft">
                <span><CheckIcon /> ATS Uyum Skoru: 100/100</span>
                <button onClick={onLoadSample}>Bu örnekle düzenle →</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Neden sade format kazandırır */}
      <section className="landing__why">
        <div className="landing__why-hd">
          <h2>Neden Klasik Format Kazandırır?</h2>
          <p>Karmaşık infografikler yerine metin odaklı taslakların tercih edilme sebepleri</p>
        </div>
        <div className="landing__why-grid">
          {WHY_ITEMS.map((it) => (
            <div className="landing__why-item" key={it.n}>
              <span className="landing__why-n">{it.n}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing__footer">
        <span>CV Studio — Sade ve ATS Uyumlu Profesyonel Özgeçmiş Aracı</span>
        <div className="landing__footer-links">
          <button onClick={onStartFresh}>Boş CV</button>
          <button onClick={onOpenUpload}>CV Yükle</button>
          <button onClick={onLoadSample}>Örnek Veri</button>
        </div>
      </footer>
    </div>
  );
}
