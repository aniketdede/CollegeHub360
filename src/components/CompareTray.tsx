import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { College } from "@/data/colleges";
import { CompareIcon } from "@/components/CollegeCard";

export function CompareTray({
  colleges,
  onRemove,
}: {
  colleges: College[];
  onRemove: (collegeId: string) => void;
}) {
  if (colleges.length === 0) return null;

  return (
    <aside className="compare-tray" aria-label="College comparison tray">
      <div className="compare-tray-copy">
        <strong><CompareIcon /> Compare your shortlist</strong>
        <span>{colleges.length} of 4 options selected</span>
        <div className="compare-pills">
          {colleges.map((college) => (
            <span className="compare-pill" key={college.id}>
              {college.initials}
              <button type="button" onClick={() => onRemove(college.id)} aria-label={`Remove ${college.name} from comparison`}>
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <Link className="button button-primary" href="#compare">
        Review comparison <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </aside>
  );
}
