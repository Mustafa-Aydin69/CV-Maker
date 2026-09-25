// components/cv/items.tsx — CV başlığı ve madde bileşenleri
import type { ReactNode } from "react";
import type { CVData, Experience, Education, Project, Certification, Award, Volunteer, Reference } from "@/lib/types";
import { dateRange, fmtMonth } from "@/lib/format";
import { placeholder, type Lang } from "@/lib/i18n";
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

export function CVHeader({ data, showPhoto, lang }: { data: CVData; showPhoto: boolean; lang: Lang }) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || placeholder("fullName", lang);
  const hasPhoto = showPhoto && !!data.photo;
  const contacts: Array<{ icon: ReactNode; val: string }> = [
    data.address  && { icon: ICON.address,  val: data.address  },
    data.phone    && { icon: ICON.phone,    val: data.phone    },
    data.email    && { icon: ICON.email,    val: data.email    },
    data.linkedin && { icon: ICON.linkedin, val: data.linkedin },
    data.github   && { icon: ICON.github,   val: data.github   },
    data.website  && { icon: ICON.web,      val: data.website  },
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
            <span className="cv__contact-ic" aria-hidden="true">{c.icon}</span>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {hasPhoto && data.photo && <img className="cv__photo" src={data.photo} alt="" />}
    </header>
  );
}

export function ExperienceItem({ it, lang }: { it: Experience; lang: Lang }) {
  const range = dateRange(it.start, it.end, it.current, lang);
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.role || placeholder("position", lang)}</span>
          {it.company  && <span className="cv__item-sub"> · {it.company}</span>}
          {it.location && <span className="cv__item-sub" style={{ color: "#666" }}> · {it.location}</span>}
        </div>
        {range && <span className="cv__item-meta">{range}</span>}
      </div>
      <Bullets text={it.description} />
    </div>
  );
}

export function EducationItem({ it, lang }: { it: Education; lang: Lang }) {
  const range = dateRange(it.start, it.end, false, lang);
  const degLine = [it.degree, it.field].filter(Boolean).join(", ");
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.school || placeholder("school", lang)}</span>
          {degLine && <span className="cv__item-sub"> · {degLine}</span>}
          {it.gpa && <span className="cv__item-sub" style={{ color: "#666" }}> · GPA {it.gpa}</span>}
        </div>
        {range && <span className="cv__item-meta">{range}</span>}
      </div>
      {it.notes && <div className="cv__item-desc">{it.notes}</div>}
    </div>
  );
}

export function ProjectItem({ it, lang }: { it: Project; lang: Lang }) {
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.name || placeholder("project", lang)}</span>
          {it.stack && <span className="cv__item-sub"> · {it.stack}</span>}
        </div>
        {it.link && <span className="cv__item-meta" style={{ fontStyle: "italic" }}>{it.link}</span>}
      </div>
      <Bullets text={it.description} />
    </div>
  );
}

export function CertificationItem({ it, lang }: { it: Certification; lang: Lang }) {
  const date = fmtMonth(it.date, lang);
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.name || placeholder("cert", lang)}</span>
          {it.issuer && <span className="cv__item-sub"> · {it.issuer}</span>}
        </div>
        {date && <span className="cv__item-meta">{date}</span>}
      </div>
      {it.link && <div className="cv__item-desc" style={{ fontSize: "0.905em", color: "#666" }}>{it.link}</div>}
    </div>
  );
}

export function AwardItem({ it, lang }: { it: Award; lang: Lang }) {
  const date = fmtMonth(it.date, lang);
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.title || placeholder("award", lang)}</span>
          {it.issuer && <span className="cv__item-sub"> · {it.issuer}</span>}
        </div>
        {date && <span className="cv__item-meta">{date}</span>}
      </div>
      {it.note && <div className="cv__item-desc">{it.note}</div>}
    </div>
  );
}

export function VolunteerItem({ it, lang }: { it: Volunteer; lang: Lang }) {
  const range = dateRange(it.start, it.end, it.current, lang);
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.role || placeholder("volRole", lang)}</span>
          {it.organization && <span className="cv__item-sub"> · {it.organization}</span>}
          {it.location && <span className="cv__item-sub" style={{ color:"#666" }}> · {it.location}</span>}
        </div>
        {range && <span className="cv__item-meta">{range}</span>}
      </div>
      <Bullets text={it.description} />
    </div>
  );
}

export function ReferenceItem({ it, lang }: { it: Reference; lang: Lang }) {
  return (
    <div className="cv__item">
      <div className="cv__item-head">
        <div>
          <span className="cv__item-title">{it.name || placeholder("reference", lang)}</span>
          {it.title   && <span className="cv__item-sub"> · {it.title}</span>}
          {it.company && <span className="cv__item-sub" style={{ color:"#666" }}> · {it.company}</span>}
        </div>
        {(it.email || it.phone) && (
          <span className="cv__item-meta">{[it.email, it.phone].filter(Boolean).join(" · ")}</span>
        )}
      </div>
      {it.note && <div className="cv__item-desc" style={{ fontStyle:"italic", color:"#666" }}>{it.note}</div>}
    </div>
  );
}
