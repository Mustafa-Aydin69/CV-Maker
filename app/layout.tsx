import type { Metadata } from "next";
import {
  Manrope, Inter, Roboto, Lato, Open_Sans, Montserrat,
  Poppins, Nunito, Merriweather, Playfair_Display, Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const manrope      = Manrope({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700","800"], variable: "--font-ui",          display: "swap" });
const inter        = Inter({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700"],          variable: "--font-inter",       display: "swap" });
const roboto       = Roboto({ subsets: ["latin","latin-ext"], weight: ["400","500","700"],               variable: "--font-roboto",      display: "swap" });
const openSans     = Open_Sans({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700"],      variable: "--font-opensans",    display: "swap" });
const lato         = Lato({ subsets: ["latin","latin-ext"], weight: ["400","700"],                       variable: "--font-lato",        display: "swap" });
const montserrat   = Montserrat({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700"],     variable: "--font-montserrat",  display: "swap" });
const poppins      = Poppins({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700"],        variable: "--font-poppins",     display: "swap" });
const nunito       = Nunito({ subsets: ["latin","latin-ext"], weight: ["400","500","600","700"],         variable: "--font-nunito",      display: "swap" });
const merriweather = Merriweather({ subsets: ["latin","latin-ext"], weight: ["400","700"], style: ["normal","italic"], variable: "--font-merriweather", display: "swap" });
const playfair     = Playfair_Display({ subsets: ["latin","latin-ext"], weight: ["400","600","700"],    variable: "--font-playfair",    display: "swap" });
const sourceSerif  = Source_Serif_4({ subsets: ["latin","latin-ext"], weight: ["400","600","700"],      variable: "--font-sourceserif", display: "swap" });

const allFonts = [manrope, inter, roboto, openSans, lato, montserrat, poppins, nunito, merriweather, playfair, sourceSerif];

export const metadata: Metadata = {
  title: "CV Studio — ATS Uyumlu",
  description: "ATS uyumlu, tek sütun, A4 CV oluşturucu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={allFonts.map((f) => f.variable).join(" ")}>
      <body>{children}</body>
    </html>
  );
}
