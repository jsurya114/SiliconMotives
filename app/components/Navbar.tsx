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
          <a href="/#services">Services</a>
          <a href="/#portfolio">Our work</a>
          <a href="/#technologies">Technologies</a>
          <a href="/#approach">How we work</a>
          <a href="/#about">Who we are</a>
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
            ["Services", "services"],
            ["Our work", "portfolio"],
            ["Our clients", "clients"],
            ["Technologies", "technologies"],
            ["Client stories", "testimonials"],
            ["How we work", "approach"],
            ["Who we are", "about"],
            ["Let’s talk", "contact"],
          ].map(([label, id]) => (
            <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
