import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Log in | CollegeHub360",
  description: "Log in to your CollegeHub360 shortlist.",
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <SiteHeader />
      <main className="auth-main">
        <div className="shell auth-shell">
          <Link className="inline-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to explore</Link>
          <AuthForm mode="login" />
        </div>
      </main>
    </div>
  );
}
