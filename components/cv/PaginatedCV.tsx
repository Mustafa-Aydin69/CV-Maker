// components/cv/PaginatedCV.tsx — İçeriği gerçek A4 sayfalarına bölen önizleme
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, Fragment, type ReactNode, type CSSProperties } from "react";
import type { CVData, PreviewOptions } from "@/lib/types";
import { CVHeader, ExperienceItem, EducationItem, ProjectItem, CertificationItem, AwardItem } from "./items";

// SSR'da useLayoutEffect uyarısını önlemek için izomorfik varyant
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// A4 @ 96dpi = 794 × 1123 px. .cv padding 56px üst/alt → kullanılabilir yükseklik.
const PAGE_CONTENT_H = 1123 - 56 * 2; // 1011px

interface Block {
  key: string;
  render: () => ReactNode;
}

function buildBlocks(data: CVData, showPhoto: boolean): Block[] {
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

  if ((data.about || "").trim()) {
    addSection("Hakkımda", [<p className="cv__about" key="about">{data.about}</p>]);
  }
  if (data.experience.length) {
    addSection("Deneyim", data.experience.map((it) => <ExperienceItem key={it._id} it={it} />));
  }
  if (data.education.length) {
    addSection("Eğitim", data.education.map((it) => <EducationItem key={it._id} it={it} />));
  }
  if (data.projects.length) {
    addSection("Projeler", data.projects.map((it) => <ProjectItem key={it._id} it={it} />));
  }
  const certs = (data.certifications ?? []).filter((c) => c.name);
  if (certs.length) {
    addSection("Sertifikalar", certs.map((it) => <CertificationItem key={it._id} it={it} />));
  }
  const awards = (data.awards ?? []).filter((a) => a.title);
  if (awards.length) {
    addSection("Ödüller", awards.map((it) => <AwardItem key={it._id} it={it} />));
  }
  const visibleSkills = data.skills.filter((c) => c.items.length > 0);
  if (visibleSkills.length) {
    addSection("Yetenekler", [
      <div className="cv__skills--cat" key="skills">
        {visibleSkills.map((c, i) => (
          <Fragment key={i}>
            <div className="cat">{c.name}:</div>
            <div>{c.items.join(" · ")}</div>
          </Fragment>
        ))}
      </div>,
    ]);
  }
  const langs = (data.languages ?? []).filter(Boolean);
  if (langs.length) {
    addSection("Yabancı Diller", [<div key="langs">{langs.join(" · ")}</div>]);
  }
  const hobbies = (data.hobbies ?? []).filter(Boolean);
  if (hobbies.length) {
    addSection("Hobiler", [<div key="hobbies">{hobbies.join(" · ")}</div>]);
  }
  return blocks;
}

export default function PaginatedCV({ data, options }: { data: CVData; options: PreviewOptions }) {
  const { showPhoto, font, accent, lineHeight, zoom } = options;
  const cvStyle = { "--cv-font": font, "--cv-accent": accent, "--cv-line-height": lineHeight } as CSSProperties;
  const blocks = useMemo(() => buildBlocks(data, showPhoto), [data, showPhoto]);
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
      let cur: number[] = [];
      let curH = 0;
      for (let i = 0; i < heights.length; i++) {
        const h = heights[i];
        if (cur.length && curH + h > PAGE_CONTENT_H) { result.push(cur); cur = []; curH = 0; }
        cur.push(i);
        curH += h;
      }
      if (cur.length) result.push(cur);
      setPages((prev) => {
        const same =
          prev.length === result.length &&
          prev.every((p, i) => p.length === result[i].length && p.every((v, j) => v === result[i][j]));
        return same ? prev : result;
      });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    Array.from(c.children).forEach((ch) => ro.observe(ch));
    return () => ro.disconnect();
  }, [blocks, font, accent, lineHeight, showPhoto]);

  return (
    <>
      <div className="cv-pages" style={{ zoom } as CSSProperties}>
        {pages.map((idxs, pi) => (
          <div className="cv-page-wrap" key={pi}>
            <div className="cv cv-page" style={cvStyle} data-page={pi + 1}>
              {idxs.map((i) => (
                <Fragment key={blocks[i].key}>{blocks[i].render()}</Fragment>
              ))}
            </div>
            {pages.length > 1 && (
              <div className="cv-page__num">{pi + 1} / {pages.length}</div>
            )}
          </div>
        ))}
      </div>
      {/* gizli ölçüm sayfası */}
      <div className="cv cv--measure" style={cvStyle} ref={measureRef} aria-hidden="true">
        {blocks.map((b) => (
          <Fragment key={b.key}>{b.render()}</Fragment>
        ))}
      </div>
    </>
  );
}
