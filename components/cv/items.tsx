// components/cv/items.tsx — CV başlığı ve madde bileşenleri
import type { ReactNode } from "react";
import type { CVData, Experience, Education, Project } from "@/lib/types";
import { dateRange } from "@/lib/format";
import { ICON } from "./Icons";

export function Bullets({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  if (lines.length === 1) return <div className="cv__item-desc">{lines[0]}</div>;
  return (
    <div className="cv__item-desc">
      <ul>
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

export function CVHeader({ data, showPhoto }: { data: CVData; showPhoto: boolean }) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Ad Soyad";
  const hasPhoto = showPhoto && !!data.photo;
  const contacts: Array<{ icon: ReactNode; val: string }> = [
    data.address && { icon: ICON.address, val: data.address },
    data.phone && { icon: ICON.phone, val: data.phone },
    data.email && { icon: ICON.email, val: data.email },
    data.linkedin && { icon: ICON.linkedin, val: data.linkedin },
    data.github && { icon: ICON.github, val: data.github },
    data.website && { icon: ICON.web, val: data.website },
  ].filter(Boolean) as Array<{ icon: ReactNode; val: string }>;

  return (
    <header className={"cv__head" + (hasPhoto ? " cv__head--with-photo" : "")}>
      <div>
        <h1 className="cv__name">{fullName}</h1>
        {data.title && <div className="cv__title">{data.title}</div>}
      </div>
      <div className="cv__contact">
        {contacts.map((c, i) => (
          <div key={i} className="cv__contact-row">
            <span className="cv__contact-val">{c.val}</span>
            <span className="cv__contact-ic" aria-hidden="true">
              {c.icon}
            </span>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {hasPhoto && data.photo && <img className="cv__photo" src={data.photo} alt="" />}
    </header>
  );
}

export function ExperienceItem({ it }: { it: Experience }) {
  const range = dateRange(it.start, it.end, it.current);
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.role || "Pozisyon"}</span>
          {it.company && <span className="cv__item-sub"> · {it.company}</span>}
          {it.location && (
            <span className="cv__item-sub" style={{ color: "#666" }}>
              {" "}
              · {it.location}
            </span>
          )}
        </div>
        {range && <span className="cv__item-meta">{range}</span>}
      </div>
      <Bullets text={it.description} />
    </div>
  );
}

export function EducationItem({ it }: { it: Education }) {
  const range = dateRange(it.start, it.end, false);
  const degLine = [it.degree, it.field].filter(Boolean).join(", ");
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.school || "Okul"}</span>
          {degLine && <span className="cv__item-sub"> · {degLine}</span>}
          {it.gpa && (
            <span className="cv__item-sub" style={{ color: "#666" }}>
              {" "}
              · GPA {it.gpa}
            </span>
          )}
        </div>
        {range && <span className="cv__item-meta">{range}</span>}
      </div>
      {it.notes && <div className="cv__item-desc">{it.notes}</div>}
    </div>
  );
}

export function ProjectItem({ it }: { it: Project }) {
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.name || "Proje"}</span>
          {it.stack && <span className="cv__item-sub"> · {it.stack}</span>}
        </div>
        {it.link && (
          <span className="cv__item-meta" style={{ fontStyle: "italic" }}>
            {it.link}
          </span>
        )}
      </div>
      <Bullets text={it.description} />
    </div>
  );
}
