// components/cv/SidebarCV.tsx — İki sütunlu şablon (sol şeritli)
"use client";

import {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
  Fragment, type CSSProperties, type ReactNode,
} from "react";
import type { CVData, PreviewOptions } from "@/lib/types";
import { CVHeader, ExperienceItem, EducationItem, ProjectItem, CertificationItem, AwardItem, VolunteerItem, ReferenceItem } from "./items";
import { ICON } from "./Icons";
import { dateRange } from "@/lib/format";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Sidebar'da her zaman sabit olan bölümler
const SIDEBAR_ONLY = new Set(["skills", "languages", "hobbies"]);

interface Block { key: string; render: () => ReactNode; }

function buildMainBlocks(data: CVData, sectionOrder: string[], hiddenSections: string[]): Block[] {
  const blocks: Block[] = [];
  const addSection = (title: string, nodes: ReactNode[]) => {
    nodes.forEach((node, idx) => {
      blocks.push({
        key: `${title}-${idx}`,
        render: () => (
          <div className={"cv__block" + (idx === 0 ? " cv__block--section" : "")}>
            {idx === 0 && <h2 className="cv__sec-h">{title}</h2>}
            {node}
          </div>
        ),
      });
    });
  };

  const visible = sectionOrder.filter((id) => !hiddenSections.includes(id) && !SIDEBAR_ONLY.has(id));

  for (const id of visible) {
    switch (id) {
      case "about":
        if ((data.about || "").trim())
          addSection("Hakkımda", [<p className="cv__about" key="about">{data.about}</p>]);
        break;
      case "experience":
        if (data.experience.length)
          addSection("Deneyim", data.experience.map((it) => <ExperienceItem key={it._id} it={it} />));
        break;
      case "education":
        if (data.education.length)
          addSection("Eğitim", data.education.map((it) => <EducationItem key={it._id} it={it} />));
        break;
      case "projects":
        if (data.projects.length)
          addSection("Projeler", data.projects.map((it) => <ProjectItem key={it._id} it={it} />));
        break;
      case "certifications": {
        const c = (data.certifications ?? []).filter((x) => x.name);
        if (c.length) addSection("Sertifikalar", c.map((it) => <CertificationItem key={it._id} it={it} />));
        break;
      }
      case "awards": {
        const a = (data.awards ?? []).filter((x) => x.title);
        if (a.length) addSection("Ödüller", a.map((it) => <AwardItem key={it._id} it={it} />));
        break;
      }
      case "volunteer": {
        const v = (data.volunteers ?? []).filter((x) => x.role);
        if (v.length) addSection("Gönüllülük", v.map((it) => <VolunteerItem key={it._id} it={it} />));
        break;
      }
      case "references": {
        const r = (data.references ?? []).filter((x) => x.name);
        if (r.length) addSection("Referanslar", r.map((it) => <ReferenceItem key={it._id} it={it} />));
        break;
      }
    }
  }

  // Özel bölümler
  for (const cs of (data.customSections ?? []).filter((c) => c.title)) {
    addSection(cs.title, [<div key="cs" className="cv__item-desc">{cs.content}</div>]);
  }

  return blocks;
}

// Sol şerit içeriği
function SidebarContent({ data, showPhoto, accentHex }: { data: CVData; showPhoto: boolean; accentHex: string }) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Ad Soyad";
  const contacts: Array<{ icon: ReactNode; val: string }> = [
    data.phone    && { icon: ICON.phone,    val: data.phone    },
    data.email    && { icon: ICON.email,    val: data.email    },
    data.address  && { icon: ICON.address,  val: data.address  },
    data.linkedin && { icon: ICON.linkedin, val: data.linkedin },
    data.github   && { icon: ICON.github,   val: data.github   },
    data.website  && { icon: ICON.web,      val: data.website  },
  ].filter(Boolean) as Array<{ icon: ReactNode; val: string }>;

  const skillCats = data.skills.filter((c) => c.items.length > 0);
  const langs     = (data.languages ?? []).filter(Boolean);
  const hobbies   = (data.hobbies   ?? []).filter(Boolean);

  return (
    <div className="cvs__sidebar">
      {/* Fotoğraf */}
      {showPhoto && data.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cvs__photo" src={data.photo} alt="" />
      )}

      {/* Ad + Ünvan */}
      <div className="cvs__name-block">
        <div className="cvs__name">{fullName}</div>
        {data.title && <div className="cvs__title">{data.title}</div>}
      </div>

      <div className="cvs__divider" />

      {/* İletişim */}
      {contacts.length > 0 && (
        <div className="cvs__section">
          <div className="cvs__sec-h">İletişim</div>
          {contacts.map((c, i) => (
            <div key={i} className="cvs__contact-row">
              <span className="cvs__contact-ic" aria-hidden="true">{c.icon}</span>
              <span className="cvs__contact-val">{c.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Yetenekler */}
      {skillCats.length > 0 && (
        <div className="cvs__section">
          <div className="cvs__sec-h">Yetenekler</div>
          {skillCats.map((c, i) => (
            <div key={i} className="cvs__skill-cat">
              <div className="cvs__skill-name">{c.name}</div>
              <div className="cvs__skill-items">{c.items.join(" · ")}</div>
            </div>
          ))}
        </div>
      )}

      {/* Diller */}
      {langs.length > 0 && (
        <div className="cvs__section">
          <div className="cvs__sec-h">Yabancı Diller</div>
          {langs.map((l, i) => <div key={i} className="cvs__skill-items">{l}</div>)}
        </div>
      )}

      {/* Hobiler */}
      {hobbies.length > 0 && (
        <div className="cvs__section">
          <div className="cvs__sec-h">Hobiler</div>
          <div className="cvs__skill-items">{hobbies.join(" · ")}</div>
        </div>
      )}
    </div>
  );
}

const SIDEBAR_W    = 210; // px
const INNER_PAD    = 32;  // main column inner padding

export default function SidebarCV({ data, options }: { data: CVData; options: PreviewOptions }) {
  const { showPhoto, font, accent, lineHeight, zoom, sectionOrder, hiddenSections, paddingPx, fontScale } = options;

  // Ana sütun içerik genişliği (ölçüm için)
  const MAIN_CONTENT_W = 794 - SIDEBAR_W - INNER_PAD * 2;
  const PAGE_CONTENT_H = 1123 - paddingPx * 2;

  const cvStyle = {
    "--cv-font":        font,
    "--cv-accent":      accent,
    "--cv-line-height": lineHeight,
    "--cv-font-scale":  String(fontScale),
  } as CSSProperties;

  const accentHex = accent;
  const blocks = useMemo(
    () => buildMainBlocks(data, sectionOrder, hiddenSections),
    [data, sectionOrder, hiddenSections],
  );

  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][]>(() => [blocks.map((_, i) => i)]);

  useIsoLayoutEffect(() => {
    const c = measureRef.current;
    if (!c) return;
    const recompute = () => {
      const kids = Array.from(c.children) as HTMLElement[];
      if (!kids.length) { setPages([[]]); return; }
      const heights = kids.map((el) => {
        const cs = getComputedStyle(el);
        return el.getBoundingClientRect().height + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
      });
      const result: number[][] = [];
      let cur: number[] = [], curH = 0;
      for (let i = 0; i < heights.length; i++) {
        const h = heights[i];
        if (cur.length && curH + h > PAGE_CONTENT_H) { result.push(cur); cur = []; curH = 0; }
        cur.push(i); curH += h;
      }
      if (cur.length) result.push(cur);
      setPages((prev) => {
        const same = prev.length === result.length &&
          prev.every((p, i) => p.length === result[i].length && p.every((v, j) => v === result[i][j]));
        return same ? prev : result;
      });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    Array.from(c.children).forEach((ch) => ro.observe(ch));
    return () => ro.disconnect();
  }, [blocks, font, lineHeight, showPhoto, paddingPx, fontScale, PAGE_CONTENT_H]);

  return (
    <>
      <div className="cv-pages" style={{ zoom } as CSSProperties}>
        {pages.map((idxs, pi) => (
          <div className="cv-page-wrap" key={pi}>
            <div className="cv cv-page cv--sidebar" style={cvStyle} data-page={pi + 1}>
              <SidebarContent data={data} showPhoto={showPhoto} accentHex={accentHex} />
              <div className="cvs__main">
                {idxs.map((i) => <Fragment key={blocks[i].key}>{blocks[i].render()}</Fragment>)}
              </div>
            </div>
            {pages.length > 1 && <div className="cv-page__num">{pi + 1} / {pages.length}</div>}
          </div>
        ))}
      </div>

      {/* Gizli ölçüm konteyneri — main column genişliğinde */}
      <div
        className="cv cv--measure"
        style={{ ...cvStyle, width: MAIN_CONTENT_W, position:"absolute", left:-100000, top:0, visibility:"hidden" } as CSSProperties}
        ref={measureRef}
        aria-hidden="true"
      >
        {blocks.map((b) => <Fragment key={b.key}>{b.render()}</Fragment>)}
      </div>
    </>
  );
}
