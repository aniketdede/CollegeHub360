import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell" style={{ padding: "120px 0" }}>
      <p className="kicker">404</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(40px, 7vw, 72px)", letterSpacing: "-0.07em" }}>That page took a different route.</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 480 }}>The page you requested is not part of the prototype yet.</p>
      <Link className="button button-primary" href="/">Return to explore</Link>
    </main>
  );
}
