"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { MQ } from "@/lib/gsap";
import { useSmoothScroll } from "./motion/SmoothScroll";
import { ArrowIcon, CloseIcon, MenuIcon } from "./ui/icons";
import { contactDetails } from "@/lib/urls";
import type { ContentRow } from "@/lib/content";

export function Header({ settings }: { settings: ContentRow }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { lenis } = useSmoothScroll();

  // Tone follows the section under the bar. The bar itself always stays in view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const set = (key: string, value: string) => {
      if (el.dataset[key] !== value) el.dataset[key] = value;
    };
    const update = () => {
      raf = 0;
      const probe = 32;
      const sections = document.querySelectorAll<HTMLElement>("[data-header]");
      let tone = "light";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          tone = s.dataset.header || "light";
          break;
        }
      }
      set("tone", tone);
      set("scrolled", String(window.scrollY > 24));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed top-3 left-3 z-[80] rounded-full bg-lagoon px-4 py-2 font-display text-sm font-semibold text-monsoon"
      >
        {site.ui.skip}
      </a>
      <header
        ref={ref}
        className="site-header fixed inset-x-0 top-0 z-50"
        data-tone="light"
        data-scrolled="false"
      >
        <div className="site-header__bar">
          <div className="wrap flex h-16 items-center justify-between">
            <a
              href="/"
              aria-label={site.ui.homeLabel}
              className="font-display text-[1.125rem] font-extrabold tracking-[-0.04em]"
            >
              {site.brand.name}
            </a>
            <nav aria-label={site.ui.mainNav} className="hidden items-center gap-1 lg:flex">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-2 font-display text-[0.9375rem] font-medium tracking-[-0.01em] opacity-80 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </a>
              ))}
              <a
              href="/contact"
                className="ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-lagoon px-4 font-display text-[0.9375rem] font-semibold text-monsoon transition-colors hover:bg-lagoon-deep"
              >
                {site.navCta.label}
                <ArrowIcon size={14} />
              </a>
            </nav>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full lg:hidden"
              style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, currentColor 25%, transparent)" }}
              aria-label={site.ui.menu}
              aria-haspopup="dialog"
              aria-controls="mobile-navigation"
              aria-expanded={open}
              onClick={() => {
                setOpen(true);
                lenis()?.stop();
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <MobileMenu
          settings={settings}
          onClose={() => {
            setOpen(false);
            lenis()?.start();
          }}
        />
      ) : null}
    </>
  );
}

function MobileMenu({ onClose, settings }: { onClose: () => void; settings: ContentRow }) {
  const ref = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const contact = contactDetails(settings);
  const { scrollTo } = useSmoothScroll();

  // A plain fixed overlay (no <dialog>), so every mobile browser renders it.
  // Its links are visible by default; CSS only adds a short entrance.
  useEffect(() => {
    const el = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    document.body.classList.add("dialog-open");
    el?.querySelector<HTMLElement>("button")?.focus();
    const media = window.matchMedia(MQ.desktop);
    const desktop = () => media.matches && onClose();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !el) return;
      // Keep focus inside the menu while it is open.
      const items = el.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    media.addEventListener("change", desktop);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("dialog-open");
      media.removeEventListener("change", desktop);
      document.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  const close = (then?: () => void) => {
    const finish = () => {
      onClose();
      then?.();
    };
    if (window.matchMedia(MQ.motion).matches) {
      setClosing(true);
      window.setTimeout(finish, 280);
    } else finish();
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={site.ui.mainNav}
      id="mobile-navigation"
      data-closing={closing || undefined}
      className="mobile-menu on-dark fixed inset-0 z-[90] h-dvh w-full overflow-y-auto bg-monsoon text-cloud"
    >
      <div className="wrap flex min-h-full flex-col pb-8">
        <div className="flex h-16 shrink-0 items-center justify-between">
          <span className="font-display text-[1.125rem] font-extrabold tracking-[-0.04em]">{site.brand.name}</span>
          <button
            type="button"
            onClick={() => close()}
            aria-label={site.ui.close}
            className="grid size-11 place-items-center rounded-full"
            style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, currentColor 25%, transparent)" }}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="mt-10 flex flex-col gap-1">
          {[...site.nav, { ...site.navCta, href: '/contact' }].map((item, i) => (
            <a
              key={item.href + item.label}
              href={item.href}
              style={{ animationDelay: `${80 + i * 45}ms` }}
              onClick={(event) => {
                const target = new URL(item.href, window.location.href);
                if (target.origin !== window.location.origin) return;
                event.preventDefault();
                const current = new URL(window.location.href);
                const sameDocument = target.pathname === current.pathname && target.search === current.search;
                close(() => {
                  if (!sameDocument) {
                    window.location.assign(`${target.pathname}${target.search}${target.hash}`);
                  } else if (target.hash) {
                    window.history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`);
                    scrollTo(target.hash);
                  }
                });
              }}
              className="mobile-menu__item display flex items-center justify-between border-b border-cloud/10 py-3 text-[clamp(2rem,9vw,3.25rem)] leading-none"
            >
              {item.label}
              <ArrowIcon size={18} />
            </a>
          ))}
        </nav>
        <p className="label mt-auto pt-10 text-mist">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <br />
          <a href={contact.phoneHref}>{contact.phone}</a>
        </p>
      </div>
    </div>
  );
}
