// components/cv/PaginatedCV.tsx — İçeriği gerçek A4 sayfalarına bölen önizleme
"use client";

import {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
  Fragment, type ReactNode, type CSSProperties,
} from "react";
import type { CVData, PreviewOptions } from "@/lib/types";
import { CVHeader, ExperienceItem, EducationItem, ProjectItem, CertificationItem, AwardItem, VolunteerItem, ReferenceItem } from "./items";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Block { key: string; render: () => ReactNode; }

function buildBlocks(
  data: CVData,
  showPhoto: boolean,
  sectionOrder: string[],
  hiddenSections: string[],
): Block[] {
  const blocks: Block[] = [
    { key: "header", render: () => <CVHeader data={data} showPhoto={showPhoto} /> },
  ];

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

  const visible = sectionOrder.filter((id) => !hiddenSections.includes(id));

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
        const certs = (data.certifications ?? []).filter((c) => c.name);
        if (certs.length)
          addSection("Sertifikalar", certs.map((it) => <CertificationItem key={it._id} it={it} />));
        break;
      }
      case "awards": {
        const awds = (data.awards ?? []).filter((a) => a.title);
        if (awds.length)
          addSection("Ödüller", awds.map((it) => <AwardItem key={it._id} it={it} />));
        break;
      }
      case "skills": {
        const vis = data.skills.filter((c) => c.items.length > 0);
        if (vis.length)
          addSection("Yetenekler", [
            <div className="cv__skills--cat" key="skills">
              {vis.map((c, i) => (
                <Fragment key={i}>
                  <div className="cat">{c.name}:</div>
                  <div>{c.items.join(" · ")}</div>
                </Fragment>
              ))}
            </div>,
          ]);
        break;
      }
      case "languages": {
        const langs = (data.languages ?? []).filter(Boolean);
        if (langs.length)
          addSection("Yabancı Diller", [<div key="langs">{langs.join(" · ")}</div>]);
        break;
      }
      case "hobbies": {
        const hobs = (data.hobbies ?? []).filter(Boolean);
        if (hobs.length)
          addSection("Hobiler", [<div key="hobs">{hobs.join(" · ")}</div>]);
        break;
      }
      case "volunteer": {
        const vols = (data.volunteers ?? []).filter((v) => v.role);
        if (vols.length)
          addSection("Gönüllülük", vols.map((it) => <VolunteerItem key={it._id} it={it} />));
        break;
      }
      case "references": {
        const refs = (data.references ?? []).filter((r) => r.name);
        if (refs.length)
          addSection("Referanslar", refs.map((it) => <ReferenceItem key={it._id} it={it} />));
        break;
      }
    }
  }

  // Özel bölümler — her zaman sona eklenir
  for (const cs of (data.customSections ?? []).filter((c) => c.title)) {
    addSection(cs.title, [<Bullets key="cs" text={cs.content} />]);
  }

  return blocks;
}

// Özel bölüm içeriği için basit bullet bileşeni
function Bullets({ text }: { text: string }) {
  if (!text?.trim()) return null;
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 1) return <div className="cv__item-desc">{lines[0]}</div>;
  return (
    <div className="cv__item-desc">
      <ul>{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}

export default function PaginatedCV({ data, options }: { data: CVData; options: PreviewOptions }) {
  const { showPhoto, font, accent, lineHeight, zoom, sectionOrder, hiddenSections, paddingPx, fontScale } = options;

  const cvStyle = {
    "--cv-font":       font,
    "--cv-accent":     accent,
    "--cv-line-height": lineHeight,
    "--cv-padding-v":  `${paddingPx}px`,
    "--cv-padding-h":  `${Math.round(paddingPx * 1.07)}px`,
    "--cv-font-scale": String(fontScale),
  } as CSSProperties;

  const blocks = useMemo(
    () => buildBlocks(data, showPhoto, sectionOrder, hiddenSections),
    [data, showPhoto, sectionOrder, hiddenSections],
  );

  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][]>(() => [blocks.map((_, i) => i)]);

  useIsoLayoutEffect(() => {
    const c = measureRef.current;
    if (!c) return;
    const pageContentH = 1123 - paddingPx * 2;

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
        if (cur.length && curH + h > pageContentH) { result.push(cur); cur = []; curH = 0; }
        cur.push(i);
        curH += h;
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
  }, [blocks, font, accent, lineHeight, showPhoto, paddingPx, fontScale]);

  return (
    <>
      <div className="cv-pages" style={{ zoom } as CSSProperties}>
        {pages.map((idxs, pi) => (
          <div className="cv-page-wrap" key={pi}>
            <div className="cv cv-page" style={cvStyle} data-page={pi + 1}>
              {idxs.map((i) => <Fragment key={blocks[i].key}>{blocks[i].render()}</Fragment>)}
            </div>
            {pages.length > 1 && (
              <div className="cv-page__num">{pi + 1} / {pages.length}</div>
            )}
          </div>
        ))}
      </div>
      <div className="cv cv--measure" style={cvStyle} ref={measureRef} aria-hidden="true">
        {blocks.map((b) => <Fragment key={b.key}>{b.render()}</Fragment>)}
      </div>
    </>
  );
}
