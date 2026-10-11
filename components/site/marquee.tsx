'use client';
import { Children, useEffect, useRef } from 'react';
export function Marquee({ kind, children }: { kind: 'client' | 'testimonial'; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const multiple = items.length > 1;
  const track = kind === 'client' ? 'client-logo-grid' : 'testimonial-grid';
  const group = kind === 'client' ? 'client-logo-group' : 'testimonial-group';
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const size = () => element.style.setProperty(`--${kind}-window-width`, `${element.clientWidth}px`);
    size();
    const observer = new ResizeObserver(size);
    observer.observe(element);
    return () => observer.disconnect();
  }, [kind]);
  return <>
    <div ref={ref} className={`${kind}-marquee`} role="region" aria-label={kind === 'client' ? 'Client showcase' : 'Client testimonials'}>
      <div id={`${kind}-track`} className={`${track}${multiple ? ' is-ready' : ''}`}>
        {multiple ? <><div className={group}>{items}</div><div className={group} aria-hidden="true" inert>{items}</div></> : items}
      </div>
    </div>
  </>;
}
