"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Database, FileCheck2, Search, Sparkles, X } from "lucide-react";
import { SiteHeader, InlineLink } from "@/components/SiteHeader";
import { CollegeCard } from "@/components/CollegeCard";
import { CompareTray } from "@/components/CompareTray";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { colleges, stateOptions, streamOptions } from "@/data/colleges";

const storageKey = "collegehub360:compare";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [stream, setStream] = useState<(typeof streamOptions)[number]>("All streams");
  const [state, setState] = useState<(typeof stateOptions)[number]>("All states");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const filteredColleges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return colleges.filter((college) => {
      const matchesQuery = !normalizedQuery || [
        college.name,
        college.city,
        college.state,
        college.type,
        ...college.tags,
        ...college.programs.map((program) => program.name),
      ].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesStream = stream === "All streams" || college.programs.some((program) => program.stream === stream);
      const matchesState = state === "All states" || college.state === state;
      return matchesQuery && matchesStream && matchesState;
    });
  }, [query, state, stream]);

  const comparedColleges = selectedIds
    .map((id) => colleges.find((college) => college.id === id))
    .filter((college): college is (typeof colleges)[number] => Boolean(college));

  function toggleCompare(collegeId: string) {
    setSelectedIds((current) => {
      if (current.includes(collegeId)) return current.filter((id) => id !== collegeId);
      if (current.length >= 4) return current;
      return [...current, collegeId];
    });
  }

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div>
              <span className="eyebrow">Research with clarity</span>
              <h1>Find a college that fits <em>your next chapter.</em></h1>
              <p className="hero-copy">Explore colleges, compare the details that matter and understand your admission options without the noise.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#discover">Explore colleges <ArrowRight size={17} aria-hidden="true" /></a>
                <Link className="button button-secondary" href="/assess">Assess my chances</Link>
              </div>
              <p className="hero-footnote"><Database size={14} aria-hidden="true" /> MVP catalog · every public record links to its source and review date</p>
              <div className="stat-strip" aria-label="CollegeHub360 MVP catalog metrics">
                <div className="stat"><strong>4</strong><span>ways to start exploring</span></div>
                <div className="stat"><strong>4</strong><span>options in a comparison</span></div>
                <div className="stat"><strong>1</strong><span>clear assessment flow</span></div>
              </div>
            </div>
            <aside className="assessment-card" aria-labelledby="assessment-teaser-title">
              <span className="kicker">Admission assessment</span>
              <h2 id="assessment-teaser-title">Turn a rank into a smarter shortlist.</h2>
              <p>See comparable evidence, missing cutoff coverage and the limitations before you trust a shortlist.</p>
              <ol className="mini-steps">
                <li><span className="step-number">01</span> Choose your exam and course</li>
                <li><span className="step-number">02</span> Add your rank and context</li>
                <li><span className="step-number">03</span> Review the source and evidence gap</li>
              </ol>
              <Link className="button button-primary" href="/assess">Open assessment <ArrowRight size={16} aria-hidden="true" /></Link>
            </aside>
          </div>
        </section>

        <section className="section" aria-labelledby="how-title">
          <div className="shell">
            <div className="section-heading">
              <div><span className="kicker">Make a decision, not a guess</span><h2 id="how-title">Everything you need to move forward.</h2></div>
              <p>CollegeHub360 puts the evidence next to the action, so a saved college is the beginning of your shortlist—not the end of your research.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card"><div className="feature-icon"><Search size={19} aria-hidden="true" /></div><h3>Explore with intent</h3><p>Search by college, course, city or exam and keep the context visible as you narrow down.</p></article>
              <article className="feature-card"><div className="feature-icon"><BookOpenCheck size={19} aria-hidden="true" /></div><h3>Compare what matters</h3><p>Put up to four compatible options side by side without hiding missing or stale information.</p></article>
              <article className="feature-card"><div className="feature-icon"><FileCheck2 size={19} aria-hidden="true" /></div><h3>See the source</h3><p>Each changing number is designed to carry its year, publisher and freshness status with it.</p></article>
            </div>
          </div>
        </section>

        <section className="section section-muted" id="discover" aria-labelledby="discover-title">
          <div className="shell">
            <div className="section-heading">
              <div><span className="kicker">Start exploring</span><h2 id="discover-title">A smaller list with a clearer point of view.</h2></div>
              <p>This first catalog slice links each program to a public source, academic-year context and a review date. Cutoffs stay separate from program facts.</p>
            </div>
            <div className="discover-layout">
              <aside className="filter-panel" aria-label="College filters">
                <h3>Refine the list</h3>
                <label className="filter-label" htmlFor="stream-filter">Stream</label>
                <select className="select-control" id="stream-filter" value={stream} onChange={(event) => setStream(event.target.value as (typeof streamOptions)[number])}>
                  {streamOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <label className="filter-label" htmlFor="state-filter">Location</label>
                <select className="select-control" id="state-filter" value={state} onChange={(event) => setState(event.target.value as (typeof stateOptions)[number])}>
                  {stateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <p className="filter-note">Catalog facts are source-linked. Cutoff references are shown only when exam, category, quota and year are comparable.</p>
              </aside>
              <div className="results-area">
                <div className="results-toolbar">
                  <div className="search-wrap">
                    <Search size={17} aria-hidden="true" />
                    <label className="sr-only" htmlFor="college-search">Search colleges, courses or cities</label>
                    <input className="search-control" id="college-search" placeholder="Search colleges, courses or cities" value={query} onChange={(event) => setQuery(event.target.value)} />
                  </div>
                  <span className="result-count" aria-live="polite">{filteredColleges.length} source-linked results</span>
                </div>
                <div className="college-list">
                  {filteredColleges.length > 0 ? filteredColleges.map((college) => (
                    <CollegeCard key={college.id} college={college} isCompared={selectedIds.includes(college.id)} onToggleCompare={() => toggleCompare(college.id)} />
                  )) : <div className="empty-state"><Sparkles size={22} aria-hidden="true" /><p>No colleges match these filters. Try a broader search.</p></div>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="compare" aria-labelledby="compare-title">
          <div className="shell">
            <div className="section-heading">
              <div><span className="kicker">Your decision canvas</span><h2 id="compare-title">Compare without losing the context.</h2></div>
              <p>Raw values come first. Interpretations and recommendations should be earned by clear methodology.</p>
            </div>
            <ComparisonPanel colleges={comparedColleges} />
          </div>
        </section>

        <section className="section section-muted" id="updates" aria-labelledby="updates-title">
          <div className="shell">
            <div className="update-callout">
              <div><span className="kicker">Keep your research together</span><h2 id="updates-title">Create an account when you are ready to save your shortlist.</h2><p>Accounts are now available on configured deployments. Verified deadline feeds and reminders remain on the roadmap.</p></div>
              <InlineLink href="/assess">Try the assessment</InlineLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="shell footer-inner"><p>© 2026 CollegeHub360</p><p>Historical references · not for admission decisions</p></div></footer>
      <CompareTray colleges={comparedColleges} onRemove={toggleCompare} />
    </div>
  );
}
