"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? { displayName, email, password } : { email, password }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "We could not complete that request.");
      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not complete that request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form-card" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="kicker">{isRegister ? "Join your decision workspace" : "Welcome back"}</p>
        <h1>{isRegister ? "Create your account" : "Log in to CollegeHub360"}</h1>
        <p className="auth-intro">
          {isRegister
            ? "Save a shortlist and return to your research across sessions."
            : "Continue your shortlist and keep your college research in one place."}
        </p>
      </div>

      {error ? <div className="form-error" role="alert" tabIndex={-1}>{error}</div> : null}

      {isRegister ? (
        <div className="form-field">
          <label htmlFor="display-name">Your name</label>
          <input id="display-name" autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required minLength={2} maxLength={80} />
        </div>
      ) : null}

      <div className="form-field">
        <label htmlFor="auth-email">Email address</label>
        <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
      </div>

      <div className="form-field">
        <label htmlFor="auth-password">Password</label>
        <input id="auth-password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isRegister ? 12 : 1} maxLength={128} />
        {isRegister ? <span className="field-help">Use 12–128 characters. Passwords are stored as Argon2id hashes.</span> : null}
      </div>

      <div className="form-card-footer auth-footer">
        <small><ShieldCheck size={14} aria-hidden="true" /> Secure session cookie · no password in the browser bundle</small>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
          {isSubmitting ? "Working" : isRegister ? "Create account" : "Log in"}
        </button>
      </div>

      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to CollegeHub360?"}{" "}
        <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link>
      </p>
    </form>
  );
}
