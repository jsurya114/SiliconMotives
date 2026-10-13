"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { WhatsAppIcon } from "./ui/icons";
import { whatsappUrl } from "@/lib/urls";

/** Appears once the hero has scrolled away; steps aside over the contact section and footer. */
export function FloatingWhatsApp({ number }: { number?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const contact = document.getElementById("contact");
      const pastHero = window.scrollY > window.innerHeight * 1.2;
      const beforeContact = !contact || contact.getBoundingClientRect().top > window.innerHeight * 0.6;
      setShow(pastHero && beforeContact);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      href={whatsappUrl(number)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-cloud py-1.5 pr-1.5 pl-4 text-ink sm:py-2 sm:pr-2 sm:pl-5 shadow-[0_18px_50px_-12px_rgba(11,26,43,0.45)] ring-1 ring-ink/10 transition-all duration-700 ease-[var(--ease-expo)] sm:right-6 sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="block leading-tight">
        <span className="block font-display text-[0.875rem] font-bold tracking-[-0.01em] sm:text-[0.9375rem]">{site.floating.line1}</span>
        <span className="block text-[0.75rem] text-slate sm:text-[0.8125rem]">{site.floating.line2}</span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center sm:size-11 rounded-full bg-[#1f9d55] text-white">
        <WhatsAppIcon size={20} />
      </span>
    </a>
  );
}
