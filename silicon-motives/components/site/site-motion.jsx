"use client";
import { useEffect } from 'react';
export function SiteMotion() {
  useEffect(() => {
    const listeners = [];
    const listen = (target, event, callback, options) => { target.addEventListener(event, callback, options); listeners.push(() => target.removeEventListener(event, callback, options)); };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionAnimations = new Set();
function animateEntrance(element, delay = 0, distance = 22) {
  if (reducedMotion.matches || !element.animate) return;
  const animation = element.animate([
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 650, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' });
  motionAnimations.add(animation);
  animation.onfinish = () => {
    motionAnimations.delete(animation);
    animation.cancel(); // Restore the element's own hover transforms.
  };
}

const introParts = document.querySelectorAll('.hero-content > .eyebrow, .hero-title-line, .hero-description, .hero-actions, .hero-footer');
introParts.forEach((element, index) => animateEntrance(element, index * 95, 20));

const revealSelector = [
  '.belief-grid > *', '.section-heading > *', '.clients-heading > *',
  '.about-copy', '.founder', '.service', '.solution',
  '.remote-grid > :first-child', '.principles article', '.work-heading > *',
  '.work-step', '.portfolio-heading > *', '.folio-item', '.testimonial-marquee',
  '.faq-section > :first-child', '.faqs', '.contact-inner > .eyebrow',
  '.contact-inner > h2', '.contact-inner > p', '.contact-inner > .button',
].join(',');
const observed = new WeakSet();
const waiting = new Set();
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
    const element = entry.target;
    element.classList.remove('reveal-pending');
    waiting.delete(element);
    revealObserver.unobserve(element);
    animateEntrance(element, Math.min(index, 3) * 70);
  });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' }) : null;

function prepareReveals() {
  // Prepare offscreen cards for their first entrance.
  for (const element of waiting) {
    if (!element.isConnected) {
      revealObserver.unobserve(element);
      waiting.delete(element);
    }
  }
  if (!revealObserver || reducedMotion.matches) return;
  document.querySelectorAll(revealSelector).forEach(element => {
    if (observed.has(element)) return;
    observed.add(element);
    // Avoid hiding CMS content that replaces a card already being read.
    if (element.getBoundingClientRect().top < window.innerHeight - 40) return;
    element.classList.add('reveal-pending');
    waiting.add(element);
    revealObserver.observe(element);
  });
}
// Keyboard navigation must never focus an invisible card.
listen(document, 'focusin', event => {
  const element = event.target.closest('.reveal-pending');
  if (!element) return;
  element.classList.remove('reveal-pending');
  waiting.delete(element);
  revealObserver?.unobserve(element);
});

const faqStates = new WeakMap();
const activeFaqs = new Set();
function setFaqOpen(details, open) {
  let state = faqStates.get(details);
  if (!state) {
    state = { open: details.open, animation: null };
    faqStates.set(details, state);
  }
  const from = details.getBoundingClientRect().height;
  if (state.animation) {
    state.animation.onfinish = null;
    state.animation.cancel();
  }
  state.open = open;
  details.classList.toggle('is-expanded', open);
  const summary = details.querySelector('summary');
  summary.setAttribute('aria-expanded', String(open));
  const finish = () => {
    details.open = state.open;
    details.classList.remove('faq-animating');
    state.animation?.cancel();
    state.animation = null;
    activeFaqs.delete(details);
  };
  if (reducedMotion.matches || !details.animate) {
    finish();
    return;
  }
  details.open = true;
  const style = getComputedStyle(details);
  const to = open ? details.getBoundingClientRect().height : summary.offsetHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  details.classList.add('faq-animating');
  state.animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both',
  });
  activeFaqs.add(details);
  state.animation.onfinish = finish;
}
// Keep native details keyboard behaviour while animating expansion.
listen(document.querySelector('.faqs'), 'click', event => {
  const summary = event.target.closest('summary');
  if (!summary) return;
  event.preventDefault();
  const details = summary.parentElement;
  const open = !(faqStates.get(details)?.open ?? details.open);
  if (open) {
    document.querySelectorAll('.faqs details[open]').forEach(other => {
      if (other !== details) setFaqOpen(other, false);
    });
  }
  setFaqOpen(details, open);
});
// Finish an in-flight expansion before text reflows to a different width.
listen(window, 'resize', () => {
  for (const details of activeFaqs) faqStates.get(details).animation?.finish();
});
listen(reducedMotion, 'change', event => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  for (const element of waiting) element.classList.remove('reveal-pending');
  waiting.clear();
  for (const animation of motionAnimations) animation.finish();
  for (const details of activeFaqs) faqStates.get(details).animation?.finish();
});

prepareReveals();


    return () => { listeners.forEach(remove => remove()); revealObserver?.disconnect(); waiting.forEach(element => element.classList.remove('reveal-pending')); motionAnimations.forEach(animation => animation.cancel()); activeFaqs.forEach(details => faqStates.get(details).animation?.cancel()); };
  }, []);
  return null;
}
