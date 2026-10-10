const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 1051px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();

const briefDialog = document.querySelector('#brief-dialog');
document.querySelector('#open-brief').addEventListener('click', () => {
  briefDialog.showModal();
  document.body.classList.add('dialog-open');
});
document.querySelector('.close-dialog').addEventListener('click', () => briefDialog.close());
briefDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
briefDialog.addEventListener('click', (event) => {
  const rect = briefDialog.getBoundingClientRect();
  if (event.target === briefDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) briefDialog.close();
});
const briefForm = document.querySelector('#brief-form');
const briefStatus = document.querySelector('#brief-status');
briefForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(briefForm);
  const content = window.SiliconContent;
  if (content?.acceptsBriefs) {
    // Bots fill the hidden field; pretend success without sending.
    if (data.get('website')) {
      briefStatus.textContent = 'Thank you. Your brief has been sent.';
      return;
    }
    const submit = briefForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    briefStatus.textContent = 'Sending…';
    try {
      await content.submitBrief({ name: data.get('name').trim(), email: data.get('email').trim(), message: data.get('project').trim() });
      briefForm.reset();
      briefStatus.textContent = 'Thank you. Your brief has been sent and we’ll be in touch soon.';
    } catch (error) {
      briefStatus.textContent = `Sorry, your brief could not be sent. ${error.message}`;
    } finally {
      submit.disabled = false;
    }
    return;
  }
  sendBriefOnWhatsApp(data);
});

function sendBriefOnWhatsApp(data) {
  const phone = window.SiliconContent?.whatsappNumber || '918590184265';
  const message = [
    'Hi Silicon Motives! I would like to discuss a project.',
    '',
    `Name: ${data.get('name').trim()}`,
    `Email: ${data.get('email').trim()}`,
    '',
    'Project details:',
    data.get('project').trim(),
  ].join('\n');
  const link = document.createElement('a');
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open WhatsApp to send your brief';
  briefStatus.replaceChildren(document.createTextNode('Your brief is ready. Review it in WhatsApp, then tap Send: '), link);
  link.click();
}

// Motion is progressive enhancement: content remains readable without JavaScript.
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
  '.work-step', '.portfolio-heading > *', '.folio-item', '.testimonial-card',
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
  // Supabase replaces some cards after the first paint.
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
document.addEventListener('focusin', event => {
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
// Delegate clicks so newly published FAQ entries work immediately.
document.querySelector('.faqs').addEventListener('click', event => {
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
window.addEventListener('resize', () => {
  for (const details of activeFaqs) faqStates.get(details).animation?.finish();
});
reducedMotion.addEventListener('change', event => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  for (const element of waiting) element.classList.remove('reveal-pending');
  waiting.clear();
  for (const animation of motionAnimations) animation.finish();
  for (const details of activeFaqs) faqStates.get(details).animation?.finish();
});
document.addEventListener('silicon:content-updated', prepareReveals);
prepareReveals();

// Duplicate only the visual track so the loop has no jump or repeated tab stops.
const clientTrack = document.querySelector('.client-logo-grid');
const clientMarquee = document.querySelector('.client-marquee');
function prepareClientMarquee() {
  if (clientTrack.querySelector(':scope > .client-logo-group')) return;
  const group = document.createElement('div');
  group.className = 'client-logo-group';
  group.append(...clientTrack.children);
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.inert = true;
  duplicate.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  clientTrack.replaceChildren(group, duplicate);
  clientTrack.classList.add('is-ready');
}
// One published client still fills a complete loop on wide screens.
const sizeClientMarquee = () => clientMarquee.style.setProperty('--client-window-width', `${clientMarquee.clientWidth}px`);
if ('ResizeObserver' in window) new ResizeObserver(sizeClientMarquee).observe(clientMarquee);
else window.addEventListener('resize', sizeClientMarquee);
sizeClientMarquee();
document.addEventListener('silicon:content-updated', prepareClientMarquee);
prepareClientMarquee();
