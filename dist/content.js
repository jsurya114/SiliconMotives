// Loads editable content from Supabase and renders it into the page.
// Without config.js values (or if a request fails) the static HTML stays as is.
(() => {
  const config = window.SM_CONFIG || {};
  const baseUrl = (config.supabaseUrl || '').replace(/\/+$/, '');
  const apiKey = config.supabaseAnonKey || '';
  const configured = Boolean(baseUrl && apiKey);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const safeUrl = (value) => (/^https?:\/\//i.test(value || '') ? escapeHtml(value) : '');
  const pad = (n) => String(n).padStart(2, '0');
  const initialsOf = (name) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  const chatIcon = '<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8m-8 4h5"/></svg>';
  const externalIcon = '<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  async function rest(path, options = {}) {
    const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
      ...options,
      headers: { apikey: apiKey, 'Content-Type': 'application/json', ...options.headers },
    });
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try { message = (await response.json()).message || message; } catch {}
      throw new Error(message);
    }
    return response.status === 200 ? response.json() : null;
  }

  const list = (table) => rest(`${table}?select=*&order=sort_order.asc,created_at.asc`);

  const renderers = {
    services(rows) {
      document.querySelector('.services-grid').innerHTML = rows.map((row, i) => `
        <article class="service"><span class="service-number">${pad(i + 1)}</span><div class="service-copy"><span class="service-kicker">${escapeHtml(row.kicker)}</span><h3>${escapeHtml(row.title)}</h3></div><p>${escapeHtml(row.description)}</p><a class="service-link" href="#contact" aria-label="Discuss ${escapeHtml(row.title)}">Discuss your project <span aria-hidden="true">${chatIcon}</span></a></article>`).join('');
    },

    team_members(rows) {
      const note = document.querySelector('.founders .founder-note');
      const cards = rows.map((row, i) => {
        const photo = safeUrl(row.photo_url);
        const avatar = photo ? `<img src="${photo}" alt="" loading="lazy" decoding="async">` : escapeHtml(initialsOf(row.name));
        return `<article class="founder ${i === 0 ? 'founder-featured' : 'founder-secondary'}"><div class="initials ${i % 2 ? 'initials-jayasoorya' : ''}" aria-hidden="true">${avatar}</div><div class="founder-meta"><span class="founder-kicker">${escapeHtml(row.kicker || `TEAM ${pad(i + 1)}`)}</span><h3>${escapeHtml(row.name)}</h3><p>${escapeHtml(row.role)}</p></div><span class="founder-index" aria-hidden="true">${pad(i + 1)}</span></article>`;
      }).join('');
      document.querySelector('.founders').innerHTML = cards + (note ? note.outerHTML : '');
    },

    projects(rows) {
      document.querySelector('.portfolio-grid').innerHTML = rows.map((row, i) => {
        const image = safeUrl(row.image_url);
        const link = safeUrl(row.project_url);
        const art = image
          ? `<div class="folio-art folio-art-photo"><img src="${image}" alt="${escapeHtml(row.image_alt)}" loading="lazy" decoding="async"></div>`
          : `<div class="folio-art folio-art-photo folio-art-empty" aria-hidden="true"><span>${escapeHtml(initialsOf(row.title))}</span></div>`;
        const action = link
          ? `<a class="folio-contact" href="${link}" target="_blank" rel="noopener noreferrer">View project ${externalIcon}</a>`
          : `<a class="folio-contact" href="#contact" aria-label="Discuss a project like ${escapeHtml(row.title)}">Discuss a similar project ${chatIcon}</a>`;
        return `<article class="folio-item" aria-labelledby="folio-title-${row.id}">${art}<div class="folio-meta"><span>${escapeHtml(row.category.toUpperCase())}</span><span>${pad(i + 1)} / ${pad(rows.length)}</span></div><h3 id="folio-title-${row.id}">${escapeHtml(row.title)}</h3><p class="folio-description">${escapeHtml(row.description)}</p><div class="folio-tags">${row.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>${action}</article>`;
      }).join('');
      document.querySelector('.portfolio-disclosure')?.remove();
    },

    clients(rows) {
      document.querySelector('.clients-heading > p')?.remove();
      const grid = document.querySelector('.client-logo-grid');
      grid.setAttribute('aria-label', 'Our clients');
      grid.innerHTML = rows.map((row) => {
        const logo = safeUrl(row.logo_url);
        const inner = logo ? `<img src="${logo}" alt="${escapeHtml(row.name)}" loading="lazy" decoding="async">` : `<span>${escapeHtml(row.name)}</span>`;
        const website = safeUrl(row.website_url);
        return website
          ? `<a class="client-logo" href="${website}" target="_blank" rel="noopener noreferrer">${inner}</a>`
          : `<div class="client-logo">${inner}</div>`;
      }).join('');
    },

    testimonials(rows) {
      document.querySelector('#testimonials .section-heading > p')?.remove();
      document.querySelector('.testimonial-grid').innerHTML = rows.map((row) => {
        const avatar = safeUrl(row.avatar_url);
        const details = [row.author_role, row.company].filter(Boolean).map(escapeHtml).join(', ');
        return `<article class="testimonial-card"><span class="quote-mark" aria-hidden="true">“</span><p>${escapeHtml(row.quote)}</p><div class="testimonial-person">${avatar ? `<img class="testimonial-avatar" src="${avatar}" alt="" loading="lazy" decoding="async">` : `<span class="avatar-placeholder testimonial-initials" aria-hidden="true">${escapeHtml(initialsOf(row.author_name))}</span>`}<div><span>${escapeHtml(row.author_name)}</span>${details ? `<small>${details}</small>` : ''}</div></div></article>`;
      }).join('');
    },

    faqs(rows) {
      document.querySelector('.faqs').innerHTML = rows.map((row) => `<details><summary>${escapeHtml(row.question)}<span aria-hidden="true">+</span></summary><p>${escapeHtml(row.answer)}</p></details>`).join('');
    },
  };

  function renderSettings(settings) {
    const links = [];
    if (settings.contact_email) links.push(`<a href="mailto:${escapeHtml(settings.contact_email)}">${escapeHtml(settings.contact_email)}</a>`);
    if (settings.contact_phone) links.push(`<a href="tel:${escapeHtml(settings.contact_phone.replace(/[^+\d]/g, ''))}">${escapeHtml(settings.contact_phone)}</a>`);
    if (settings.whatsapp_number) links.push(`<a href="https://wa.me/${escapeHtml(settings.whatsapp_number)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`);
    if (safeUrl(settings.linkedin_url)) links.push(`<a href="${safeUrl(settings.linkedin_url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
    if (safeUrl(settings.instagram_url)) links.push(`<a href="${safeUrl(settings.instagram_url)}" target="_blank" rel="noopener noreferrer">Instagram</a>`);
    const note = document.querySelector('.contact-note');
    if (note && links.length) note.innerHTML = links.join('<span aria-hidden="true"> · </span>');

    if (settings.accepting_briefs) {
      const dialog = document.querySelector('#brief-dialog');
      dialog.querySelector(':scope > p').textContent = 'Share a few details and we’ll get back to you. We only use them to reply to your enquiry.';
      dialog.querySelector('button[type="submit"]').firstChild.textContent = 'Send project brief ';
      document.querySelector('#open-brief').firstChild.textContent = 'Send us a project brief ';
      api.acceptsBriefs = true;
    }
  }

  const api = {
    configured,
    acceptsBriefs: false,
    async submitBrief({ name, email, message }) {
      await rest('contact_submissions', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ name, email, message }),
      });
    },
  };
  window.SiliconContent = api;
  if (!configured) return;

  rest('site_settings?select=*&id=eq.1')
    .then(([settings]) => settings && renderSettings(settings))
    .catch((error) => console.warn('Silicon Motives: could not load settings.', error));

  Object.entries(renderers).forEach(([table, render]) => {
    list(table)
      .then((rows) => { if (rows.length) render(rows); })
      .catch((error) => console.warn(`Silicon Motives: could not load ${table}.`, error));
  });
})();
