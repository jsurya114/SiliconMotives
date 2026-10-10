import { safeUrl } from '/content-model.js';
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node; }
function image(url, name, className, logo = false) {
  const wrapper = el('div', className); const fallback = el('span', 'content-image-fallback', name); wrapper.append(fallback);
  if (safeUrl(url)) { const img = el('img'); img.src = safeUrl(url); img.alt = name; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; if (logo) img.className = 'logo-image'; img.addEventListener('load', () => fallback.hidden = true); img.addEventListener('error', () => img.remove()); wrapper.append(img); }
  return wrapper;
}
function link(url, label, className) { const a = el('a', className, label); a.href = safeUrl(url) || '#contact'; if (safeUrl(url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
function renderProjects(items) {
  const grid = document.querySelector('.portfolio-grid'); grid.replaceChildren();
  if (!items.length) { grid.append(el('p','cms-empty','Our project stories are on the way. Let’s talk about what you’re building.')); }
  items.forEach((item,index) => {
    const card = el('article','folio-item'); card.append(image(item.data.image_url, item.title, 'published-project-image'));
    const meta = el('div','folio-meta'); meta.append(el('span','',item.data.category), el('span','',String(index+1).padStart(2,'0')));
    const tags = el('div','folio-tags'); (item.data.tags || '').split(',').map(value=>value.trim()).filter(Boolean).slice(0,8).forEach(tag=>tags.append(el('span','',tag)));
    card.append(meta, el('h3','',item.title), el('p','folio-description',item.data.summary), tags, link(item.data.link_url, safeUrl(item.data.link_url) ? 'Visit project website' : 'Discuss a similar project','folio-contact')); grid.append(card);
  });
  document.querySelector('.portfolio-disclosure').hidden = true;
  document.querySelector('.portfolio-heading>p').textContent = 'A selection of the products and systems we build with our clients.';
}
function renderClients(items) {
  const grid = document.querySelector('.client-logo-grid'); grid.replaceChildren(); grid.setAttribute('aria-label','Our clients');
  document.querySelector('.clients-heading>p').textContent = items.length ? 'Teams we’re proud to work with.' : 'New collaborations. Shared ambitions.';
  if (!items.length) grid.append(el('p','cms-empty','Client stories will appear here soon.'));
  items.forEach(item => { const card = safeUrl(item.data.link_url) ? link(item.data.link_url,'','published-client') : el('div','published-client'); card.append(image(item.data.image_url,item.title,'published-client-logo',true)); grid.append(card); });
}
function renderTestimonials(items) {
  const grid = document.querySelector('.testimonial-grid'); grid.replaceChildren();
  document.querySelector('#testimonials .section-heading>p').textContent = items.length ? 'Shared by the people we work with.' : 'Client feedback will appear here when it’s ready to share.';
  if (!items.length) grid.append(el('p','cms-empty','We look forward to sharing our clients’ experiences.'));
  items.forEach(item => { const card = el('article','testimonial-card'); const quote = el('span','quote-mark','“'); quote.setAttribute('aria-hidden','true'); const person = el('div','testimonial-person'); const details = el('div'); details.append(el('span','',item.title), el('small','',[item.data.role,item.data.company].filter(Boolean).join(' · '))); person.append(image(item.data.image_url,item.title,'testimonial-avatar'),details); card.append(quote,el('p','published-quote',item.data.quote),person); grid.append(card); });
}
function renderFaqs(items) {
  const list = document.querySelector('.faqs'); list.replaceChildren();
  if (!items.length) { list.append(el('p','cms-empty','Have a question? Start a conversation with our team.')); return; }
  items.forEach(item => { const details = el('details'); const summary = el('summary','',item.title); const plus = el('span','','+'); plus.setAttribute('aria-hidden','true'); summary.append(plus); details.append(summary,el('p','',item.data.answer)); list.append(details); });
}
async function refresh() {
  try {
    const response = await fetch('/api/content', { cache:'no-store' });
    if (!response.ok) return; // Keep the static site available during setup or an outage.
    const { items } = await response.json();
    if (!Array.isArray(items)) return;
    renderProjects(items.filter(item=>item.kind==='projects'));
    renderClients(items.filter(item=>item.kind==='clients'));
    renderTestimonials(items.filter(item=>item.kind==='testimonials'));
    renderFaqs(items.filter(item=>item.kind==='faqs'));
  } catch { /* The original page remains usable without a database or network. */ }
}
refresh();
// A returning visitor sees changes without waiting for a redeployment.
let lastRefresh = Date.now();
document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now()-lastRefresh>15000) { lastRefresh=Date.now(); refresh(); } });
