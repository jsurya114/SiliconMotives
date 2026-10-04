"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/#capabilities">Capabilities</a>
          <a href="/#case-study">Case study</a>
          <a href="/#process">Process</a>
          <a href="/agency-partners">Agency partners</a>
          <a href="/#team">Team</a>
        </nav>
        <a href="/#contact" className="nav-cta">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ["Capabilities", "/#capabilities"],
            ["Case study", "/#case-study"],
            ["Process", "/#process"],
            ["Agency partners", "/agency-partners"],
            ["Team", "/#team"],
            ["Questions", "/#faq"],
            ["Let’s talk", "/#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
