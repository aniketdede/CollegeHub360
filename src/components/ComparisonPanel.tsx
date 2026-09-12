import { ArrowRight, CheckCircle2, CircleHelp } from "lucide-react";
import type { College } from "@/data/colleges";

export function ComparisonPanel({ colleges }: { colleges: College[] }) {
  if (colleges.length === 0) {
    return (
      <div className="empty-state">
        <CircleHelp size={22} aria-hidden="true" />
        <p>Add two or more colleges above to compare their course context, route and freshness status.</p>
      </div>
    );
  }

  return (
    <div className="comparison-table-wrap">
      <div className="comparison-table comparison-desktop" role="table" aria-label="Selected colleges comparison">
        <div className="comparison-row comparison-heading" role="row">
          <div role="columnheader">Decision signal</div>
          {colleges.map((college) => <div role="columnheader" key={college.id}>{college.name}</div>)}
        </div>
        <div className="comparison-row" role="row">
          <div role="rowheader">Location</div>
          {colleges.map((college) => <div role="cell" key={college.id}>{college.city}, {college.state}</div>)}
        </div>
        <div className="comparison-row" role="row">
          <div role="rowheader">Program context</div>
          {colleges.map((college) => <div role="cell" key={college.id}>{college.programs[0]?.name ?? "Not reported"}</div>)}
        </div>
        <div className="comparison-row" role="row">
          <div role="rowheader">Admission route</div>
          {colleges.map((college) => <div role="cell" key={college.id}>{college.programs[0]?.exam ?? "Not reported"}</div>)}
        </div>
        <div className="comparison-row" role="row">
          <div role="rowheader">Data status</div>
          {colleges.map((college) => <div role="cell" key={college.id}><CheckCircle2 size={14} aria-hidden="true" /> {college.updatedAt}</div>)}
        </div>
      </div>
      <div className="comparison-mobile" aria-label="Selected colleges comparison">
        {colleges.map((college) => (
          <article className="comparison-mobile-card" key={college.id}>
            <h3>{college.name}</h3>
            <dl>
              <div><dt>Location</dt><dd>{college.city}, {college.state}</dd></div>
              <div><dt>Program context</dt><dd>{college.programs[0]?.name ?? "Not reported"}</dd></div>
              <div><dt>Admission route</dt><dd>{college.programs[0]?.exam ?? "Not reported"}</dd></div>
              <div><dt>Data status</dt><dd><CheckCircle2 size={14} aria-hidden="true" /> {college.updatedAt}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <p className="comparison-footnote"><ArrowRight size={14} aria-hidden="true" /> Raw values are shown first. Each catalog card links to the reviewed source and academic-year context.</p>
    </div>
  );
}
