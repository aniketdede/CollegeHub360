"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, CircleUserRound, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/#discover", label: "Explore colleges" },
  { href: "/#compare", label: "Compare" },
  { href: "/assess", label: "Assess chances" },
  { href: "/#updates", label: "Updates" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="CollegeHub360 home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CollegeHub<span>360</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
          <Link className="header-login" href="/login">Log in</Link>
          <Link className="account-button" href="/register" aria-label="Create account">
            <CircleUserRound size={18} strokeWidth={1.8} />
            <span>Create account</span>
          </Link>
        </div>
      </div>
      <nav className={`mobile-nav ${isMenuOpen ? "is-open" : ""}`} id="mobile-navigation" aria-label="Mobile navigation">
        {navItems.map((item) => <Link href={item.href} key={item.href} onClick={closeMenu}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}
      </nav>
    </header>
  );
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="inline-link" href={href}>
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
    </Link>
  );
}
