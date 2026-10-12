'use client';
import { useEffect, useState } from 'react';
import { ChatIcon } from './icons';
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const media = matchMedia('(min-width: 1051px)');
    const resize = () => { if (media.matches) setOpen(false); };
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('keydown', escape); media.addEventListener('change', resize);
    return () => { window.removeEventListener('scroll', scroll); document.removeEventListener('keydown', escape); media.removeEventListener('change', resize); };
  }, []);
  return <header className={`header${scrolled ? ' is-scrolled' : ''}`}><div className="site-container header-inner flex items-center justify-between">
    <a className="brand-text" href="#home" aria-label="Silicon Motives home">Silicon Motives</a>
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}><span className="menu-icon" aria-hidden="true"><i></i><i></i><i></i></span></button>
    <nav id="navigation" className={open ? 'is-open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      {[['home', 'Home'], ['about', 'About'], ['services', 'Services'], ['solutions', 'Solutions'], ['testimonials', 'Testimonials'], ['portfolio', 'Portfolio']].map(([id, text]) => <a key={id} href={`#${id}`}>{text}</a>)}
      <a className="nav-cta" href="#contact">Let’s talk <span aria-hidden="true"><ChatIcon /></span></a>
    </nav>
  </div></header>;
}
