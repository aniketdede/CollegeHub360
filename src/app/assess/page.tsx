import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { AssessmentForm } from "@/components/AssessmentForm";

export const metadata = {
  title: "Admission assessment | CollegeHub360",
  description: "Explore a source-linked historical admission assessment with clear limitations.",
};

export default function AssessPage() {
  return (
    <div className="assess-page">
      <SiteHeader />
      <main>
        <section className="assess-hero">
          <div className="shell">
            <Link className="inline-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to explore</Link>
            <p className="kicker" style={{ marginTop: 34 }}>Admission assessment</p>
            <h1>Make your rank useful before counselling begins.</h1>
            <p>Start with a historical match, understand how each option was classified and build a shortlist you can investigate further.</p>
          </div>
        </section>
        <section className="assess-main">
          <div className="shell"><AssessmentForm /></div>
        </section>
      </main>
      <footer className="footer"><div className="shell footer-inner"><p>© 2026 CollegeHub360</p><p>Historical references · not for admission decisions</p></div></footer>
    </div>
  );
}
