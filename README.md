# CV Maker — ATS Uyumlu

> Next.js 14 · TypeScript · jsPDF · html2canvas

Solda form, sağda gerçek zamanlı **A4 / ATS uyumlu** CV önizlemesi. Tek tıkla
metin tabanlı PDF indirme, fotoğraf opsiyonu, yazı tipi & aksan rengi seçimi,
canlı ATS skoru ve otomatik sayfalama (içerik taşınca temiz şekilde 2. A4'e geçer).

## Gereksinimler

- Node.js 18.17+ (veya 20+)
- npm (ya da pnpm / yarn)

## Kurulum & çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini aç.

Üretim derlemesi:

```bash
npm run build
npm start
```

## Proje yapısı

```
app/
  layout.tsx          Kök layout + Manrope fontu
  page.tsx            Ana uygulama (durum + düzen)
  globals.css         Tüm stiller
components/
  form/               Sol panel (form bölümleri)
    primitives.tsx    Section / Field
    PersonalSection.tsx
    sections.tsx      Hakkımda / Deneyim / Eğitim / Projeler
    SkillsSection.tsx
    ListSection.tsx   Genel ekle/sil/sırala listesi
    CVForm.tsx        Sol panelin tamamı
  cv/                 Sağ panel (önizleme)
    Icons.tsx         İletişim ikonları
    items.tsx         Başlık + madde bileşenleri
    PaginatedCV.tsx   A4 sayfalama motoru
  PreviewPane.tsx     Araç çubuğu + önizleme
  SettingsPanel.tsx   Görünüm ayarları (font, renk, zoom, ATS listesi)
hooks/
  useLocalStorage.ts  SSR-güvenli kalıcı durum
lib/
  types.ts            Tüm TypeScript tipleri
  defaultData.ts      Varsayılan içerik + font/renk seçenekleri
  format.ts           Tarih biçimleme
  atsScore.ts         ATS skoru hesaplama
  pdf.ts              jsPDF ile metin tabanlı PDF (+ görüntü yedeği)
```

## Mimari notları

- **Tamamen client-side.** Veriler `localStorage`'da tutulur; backend yoktur.
  Çok kullanıcılı bir ürün için sonraki adım: kimlik doğrulama + veritabanı
  (örn. Supabase / Postgres) ve PDF üretimini sunucuya taşımak.
- **PDF, metin tabanlıdır** (jsPDF) — ATS sistemleri metni okuyabilir. Türkçe
  karakterler için Roboto fontu CDN'den çekilip gömülür. Font yüklenemezse
  otomatik olarak `html2canvas` ile her A4 sayfasını ayrı yakalayan görüntü
  yedeğine düşer.
- **Sayfalama** istemcide ölçümle yapılır: her bölüm/madde bölünmez bir "blok"tur,
  bir sayfaya sığmazsa tamamen sonraki A4'e iner (başlık asla yalnız kalmaz).
- `pdf.ts` ve `html2canvas` yalnızca tarayıcıda çalışır; `dynamic import` ile
  yüklenir, SSR'ı etkilemez.

## Sonraki adımlar (öneri)

- Birden fazla CV kaydetme + şablon galerisi
- Kullanıcı hesapları (NextAuth) ve bulut senkronizasyonu
- Paylaşılabilir herkese açık CV linkleri (`/cv/[id]`)
- Sunucu tarafı PDF (`@react-pdf/renderer` veya Puppeteer)
- İngilizce / Türkçe dil değiştirici (i18n)
