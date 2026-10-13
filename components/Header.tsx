"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, MQ } from "@/lib/gsap";
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
              href="#home"
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
                href={site.navCta.href}
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
  const ref = useRef<HTMLDialogElement>(null);
  const contact = contactDetails(settings);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    document.body.classList.add('dialog-open');
    const media = window.matchMedia(MQ.desktop);
    const desktop = () => {
      if (media.matches) {
        d.close();
        onClose();
      }
    };
    media.addEventListener('change', desktop);
    if (window.matchMedia(MQ.motion).matches) {
      const tl = gsap.timeline();
      tl.fromTo(d, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" }).from(
        d.querySelectorAll("[data-menu-item]"),
        { yPercent: 110, duration: 1, stagger: 0.06, ease: "expo.out" },
        "-=0.35",
      );
    }
    return () => { document.body.classList.remove('dialog-open'); media.removeEventListener('change', desktop); };
  }, []);

  const close = (then?: () => void) => {
    const d = ref.current;
    const finish = () => {
      d?.close();
      onClose();
      then?.();
    };
    if (d && window.matchMedia(MQ.motion).matches) {
      gsap.to(d, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: finish });
    } else finish();
  };

  return (
    <dialog
      ref={ref}
      aria-label={site.ui.mainNav}
      className="on-dark fixed inset-0 m-0 h-svh max-h-none w-screen max-w-none bg-monsoon p-0 text-cloud backdrop:bg-transparent"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="wrap flex h-full flex-col pb-8">
        <div className="flex h-16 items-center justify-between">
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
        <nav className="mt-auto flex flex-col gap-1 px-5">
          {[...site.nav, site.navCta].map((item) => (
            <span key={item.href + item.label} className="overflow-hidden">
              <a
                data-menu-item=""
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  close(() => document.querySelector(item.href)?.scrollIntoView({ behavior: "instant" }));
                }}
                className="display block py-1 text-[clamp(2.5rem,11vw,4.5rem)] leading-none"
              >
                {item.label}
              </a>
            </span>
          ))}
        </nav>
        <p className="label mt-10 px-5 text-mist">
          {contact.email}
          <br />
          {contact.phone}
        </p>
      </div>
    </dialog>
  );
}
