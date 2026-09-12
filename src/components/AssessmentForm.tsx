"use client";

import { useId, useState } from "react";
import { ArrowRight, ExternalLink, LoaderCircle, ShieldCheck } from "lucide-react";
import type { AdmissionBand } from "@/data/colleges";
import type { AssessmentMatch } from "@/lib/assessment";

const exams = ["JEE Main", "MHT-CET"] as const;
const categories = ["Open", "OBC", "SC", "ST", "EWS"] as const;
const courses = ["All courses", "Computer", "Information Technology", "Management"] as const;

const bandClass: Record<AdmissionBand, string> = {
  Safe: "band-safe",
  Target: "band-target",
  Ambitious: "band-ambitious",
  "Insufficient data": "band-insufficient-data",
};

type ApiResponse = {
  matches?: AssessmentMatch[];
  metadata?: {
    dataStatus: string;
    disclaimer: string;
  };
  message?: string;
};

export function AssessmentForm() {
  const formId = useId();
  const [exam, setExam] = useState<(typeof exams)[number]>("JEE Main");
  const [rank, setRank] = useState("");
  const [course, setCourse] = useState<(typeof courses)[number]>("All courses");
  const [category, setCategory] = useState<(typeof categories)[number]>("Open");
  const [state, setState] = useState("Maharashtra");
  const [matches, setMatches] = useState<AssessmentMatch[] | null>(null);
  const [metadata, setMetadata] = useState<ApiResponse["metadata"]>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMatches(null);
    setMetadata(undefined);

    const parsedRank = Number(rank);
    if (!Number.isInteger(parsedRank) || parsedRank <= 0) {
      setError("Enter a valid positive rank, for example 12450.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/assessments/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: parsedRank, course, category, state }),
      });
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok) throw new Error(payload.message || "We could not complete the assessment.");
      setMatches(payload.matches ?? []);
      setMetadata(payload.metadata);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not complete the assessment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="assess-layout">
      <form className="assess-form-card" onSubmit={handleSubmit} noValidate>
        <p className="kicker">Four inputs, one clearer starting point</p>
        <h2>Tell us where you stand</h2>
        <p className="form-intro">We use your rank as a starting point for historical matching. We never promise admission.</p>
        {error ? <div className="form-error" role="alert" tabIndex={-1}>{error}</div> : null}

        <div className="form-field">
          <label htmlFor={`${formId}-exam`}>Exam or admission route</label>
          <select id={`${formId}-exam`} value={exam} onChange={(event) => setExam(event.target.value as (typeof exams)[number])}>
            {exams.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-rank`}>Your rank</label>
          <input
            id={`${formId}-rank`}
            inputMode="numeric"
            min="1"
            placeholder="e.g. 12450"
            type="number"
            value={rank}
            onChange={(event) => setRank(event.target.value)}
            aria-describedby={`${formId}-rank-help`}
            required
          />
          <span className="field-help" id={`${formId}-rank-help`}>Use the official rank for the selected exam and category.</span>
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-course`}>Course area</label>
          <select id={`${formId}-course`} value={course} onChange={(event) => setCourse(event.target.value as (typeof courses)[number])}>
            {courses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-category`}>Category</label>
          <select id={`${formId}-category`} value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-state`}>Preferred state</label>
          <select id={`${formId}-state`} value={state} onChange={(event) => setState(event.target.value)}>
            <option>Maharashtra</option>
            <option>All states</option>
          </select>
        </div>

        <div className="form-card-footer">
          <small><ShieldCheck size={14} aria-hidden="true" /> Your inputs are used only for this assessment request.</small>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            {isSubmitting ? "Checking" : "See assessment"}
          </button>
        </div>
      </form>

      <section className="assess-results-card" aria-live="polite" aria-labelledby={`${formId}-results-title`}>
        <div className="results-header">
          <div>
            <p className="kicker">Evidence first</p>
            <h2 id={`${formId}-results-title`}>Your starting shortlist</h2>
            <p>Every card shows its source and evidence gap. No cutoff is guessed when an official row is missing.</p>
          </div>
        </div>
        {metadata ? <div className="data-notice"><strong>{metadata.dataStatus}</strong><br />{metadata.disclaimer}</div> : null}
        {!matches ? <p className="no-results">Submit the form to see source-linked matches and evidence gaps.</p> : null}
        {matches && matches.length === 0 ? <p className="no-results">No source-linked programs matched those filters. Try All states or All courses.</p> : null}
        {matches && matches.length > 0 ? (
          <div className="match-list">
            {matches.map((match) => (
              <article className="match-card" key={match.programId}>
                <div className="match-card-top">
                  <div>
                    <h3>{match.collegeName}</h3>
                    <p>{match.programName} · {match.city}</p>
                  </div>
                  <span className={`band ${bandClass[match.band]}`}>{match.band}</span>
                </div>
                <div className="match-meta">
                  <span>{match.closingRank ? `Closing rank: ${match.closingRank.toLocaleString("en-IN")}` : "Closing rank: not reported"}</span>
                  <span>{match.cutoffYear ? `${match.cutoffYear} · ${match.cutoffRound}` : "No comparable cutoff"}</span>
                  <span>{match.cutoffQuota}</span>
                </div>
                <p className="match-reason">{match.reason}</p>
                <p className="match-source">
                  <a href={match.source.url} target="_blank" rel="noreferrer">
                    <ExternalLink size={13} aria-hidden="true" /> {match.source.label} · {match.source.publisher}
                  </a>
                  <span>{match.dataStatus} · {match.source.dataYear ? `academic-year context: ${match.source.dataYear}` : "academic-year context not stated"} · reviewed {match.source.accessedOn}</span>
                  {match.caveat ? <span>{match.caveat}</span> : null}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
