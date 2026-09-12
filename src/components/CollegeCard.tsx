import { Check, ExternalLink, GitCompareArrows, MapPin, Plus } from "lucide-react";
import type { College } from "@/data/colleges";

export function CollegeCard({
  college,
  isCompared,
  onToggleCompare,
}: {
  college: College;
  isCompared: boolean;
  onToggleCompare: () => void;
}) {
  const primaryProgram = college.programs[0];

  return (
    <article className="college-card">
      <div className="college-initials" aria-hidden="true">{college.initials}</div>
      <div>
        <div className="prototype-label">{college.dataStatus}</div>
        <h3>{college.name}</h3>
        <div className="college-meta">
          <span><MapPin size={13} aria-hidden="true" /> {college.city}, {college.state}</span>
          <span>{college.type}</span>
        </div>
        <p className="college-description">{college.description}</p>
        <div className="tag-row" aria-label="College tags">
          {college.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          <span className="tag">{primaryProgram?.name}</span>
          {primaryProgram?.intake ? <span className="tag">{primaryProgram.intake} seats · {primaryProgram.intakeYear}</span> : null}
        </div>
      </div>
      <div className="card-actions">
        <button
          className={`card-action ${isCompared ? "active" : ""}`}
          type="button"
          onClick={onToggleCompare}
          aria-pressed={isCompared}
          aria-label={`${isCompared ? "Remove" : "Add"} ${college.name} ${isCompared ? "from" : "to"} comparison`}
        >
          {isCompared ? <Check size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          {isCompared ? "Added" : "Compare"}
        </button>
        <div className="card-source-row">
          <span className="college-meta">{college.updatedAt} · reviewed {college.source.accessedOn}</span>
          <a className="source-link" href={college.source.url} target="_blank" rel="noreferrer">
            <ExternalLink size={13} aria-hidden="true" /> {college.source.label}
          </a>
        </div>
      </div>
      <span className="sr-only">Compare up to four options.</span>
    </article>
  );
}

export function CompareIcon() {
  return <GitCompareArrows size={16} aria-hidden="true" />;
}
