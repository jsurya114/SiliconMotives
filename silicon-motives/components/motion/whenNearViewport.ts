/** Prepare scroll effects shortly before they can become visible. */
export function whenNearViewport(element: HTMLElement, setup: () => void | (() => void)) {
  let started = false;
  let disposed = false;
  let cleanup: void | (() => void);
  let observer: IntersectionObserver | undefined;

  const start = () => {
    if (started || disposed) return;
    started = true;
    observer?.disconnect();
    cleanup = setup();
  };
  const rect = element.getBoundingClientRect();
  if (typeof IntersectionObserver === 'undefined' || (rect.top <= window.innerHeight + 300 && rect.bottom >= -300)) {
    start();
  } else {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) start();
    }, { rootMargin: '300px 0px' });
    observer.observe(element);
  }

  return () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    if (typeof cleanup === 'function') cleanup();
  };
}
