import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV Maker — ATS Uyumlu",
  description: "ATS uyumlu, tek sütun, A4 CV oluşturucu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
