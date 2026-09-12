import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Create account | CollegeHub360",
  description: "Create a CollegeHub360 account for your college shortlist.",
};

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <SiteHeader />
      <main className="auth-main">
        <div className="shell auth-shell">
          <Link className="inline-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to explore</Link>
          <AuthForm mode="register" />
        </div>
      </main>
    </div>
  );
}
