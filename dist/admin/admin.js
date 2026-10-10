const config = window.SM_CONFIG || {};
const app = document.querySelector('#app');
const editor = document.querySelector('#editor');
const MEDIA_BUCKET = 'media';
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'];

// ── Content model ─────────────────────────────────────────────────────────
// Each collection maps to a Supabase table. Fields drive both the list view
// and the edit form.
const collections = {
  services: {
    label: 'Services',
    singular: 'service',
    intro: 'The four cards in “What we do”. Order here is the order on the site.',
    title: (row) => row.title,
    subtitle: (row) => row.kicker,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
      { name: 'kicker', label: 'Small label', type: 'text', max: 40, help: 'Shown above the title, e.g. PRODUCT BUILD.' },
      { name: 'description', label: 'Description', type: 'textarea', max: 400 },
    ],
    defaults: { published: true },
  },
  team_members: {
    label: 'Team',
    singular: 'team member',
    intro: 'People shown in “The people behind the purpose”. The first person gets the featured card.',
    title: (row) => row.name,
    subtitle: (row) => row.role,
    image: 'photo_url',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, max: 80 },
      { name: 'role', label: 'Role', type: 'text', max: 80, help: 'e.g. Co-founder' },
      { name: 'kicker', label: 'Small label', type: 'text', max: 40, help: 'e.g. FOUNDER 01. Leave empty to use TEAM 01, TEAM 02…' },
      { name: 'photo_url', label: 'Photo', type: 'image', help: 'Square image works best. Without a photo, initials are shown.' },
    ],
    defaults: { published: true },
  },
  projects: {
    label: 'Portfolio',
    singular: 'project',
    intro: 'Once at least one project is published, it replaces the illustrative concepts on the site.',
    title: (row) => row.title,
    subtitle: (row) => [row.category, row.tags.join(', ')].filter(Boolean).join(' · '),
    image: 'image_url',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 100 },
      { name: 'category', label: 'Category', type: 'text', max: 60, help: 'e.g. Custom software' },
      { name: 'description', label: 'Description', type: 'textarea', max: 500 },
      { name: 'tags', label: 'Tags', type: 'tags', help: 'Comma separated, up to 8.' },
      { name: 'image_url', label: 'Cover image', type: 'image', help: 'Landscape, around 1200 × 800.' },
      { name: 'image_alt', label: 'Image description', type: 'text', max: 200, help: 'Describes the image for screen readers.' },
      { name: 'project_url', label: 'Project link', type: 'url', help: 'Optional. Leave empty to show “Discuss a similar project”.' },
    ],
    defaults: { published: false, tags: [] },
  },
  clients: {
    label: 'Clients',
    singular: 'client',
    intro: 'Logos in “Our clients”. Once one is published, the placeholders are replaced.',
    title: (row) => row.name,
    subtitle: (row) => row.website_url,
    image: 'logo_url',
    fields: [
      { name: 'name', label: 'Client name', type: 'text', required: true, max: 80 },
      { name: 'logo_url', label: 'Logo', type: 'image', help: 'Transparent PNG or SVG. Without a logo, the name is shown.' },
      { name: 'website_url', label: 'Website', type: 'url' },
    ],
    defaults: { published: false },
  },
  testimonials: {
    label: 'Testimonials',
    singular: 'testimonial',
    intro: 'Client quotes. Only publish feedback the client has agreed to share.',
    title: (row) => row.author_name,
    subtitle: (row) => row.quote,
    image: 'avatar_url',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true, max: 800 },
      { name: 'author_name', label: 'Name', type: 'text', required: true, max: 80 },
      { name: 'author_role', label: 'Role', type: 'text', max: 80 },
      { name: 'company', label: 'Company', type: 'text', max: 80 },
      { name: 'avatar_url', label: 'Photo', type: 'image' },
    ],
    defaults: { published: false },
  },
  faqs: {
    label: 'FAQs',
    singular: 'question',
    intro: 'Questions in “Before we get started”.',
    title: (row) => row.question,
    subtitle: (row) => row.answer,
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, max: 200 },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, max: 1500 },
    ],
    defaults: { published: true },
  },
};

const settingsFields = [
  { name: 'contact_email', label: 'Contact email', type: 'email', max: 254, help: 'Shown in the contact section.' },
  { name: 'contact_phone', label: 'Phone', type: 'tel', max: 40 },
  { name: 'whatsapp_number', label: 'WhatsApp number', type: 'text', max: 20, help: 'Digits only, with country code, e.g. 919876543210.', pattern: '[0-9]*' },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
];

const submissionStatuses = ['new', 'read', 'replied', 'archived'];

// ── Helpers ───────────────────────────────────────────────────────────────
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const initialsOf = (text) => String(text || '').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
const formatDate = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function toast(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast${type === 'error' ? ' toast-error' : ''}`;
  el.textContent = message;
  document.querySelector('#toasts').append(el);
  setTimeout(() => el.remove(), type === 'error' ? 6000 : 3500);
}

function fail(error) {
  console.error(error);
  toast(error?.message || 'Something went wrong.', 'error');
}

// Throws on Supabase errors so callers can use try/catch.
async function run(promise) {
  const { data, error, count } = await promise;
  if (error) throw error;
  return count ?? data;
}

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  app.innerHTML = `<div class="auth"><div class="auth-card"><p class="eyebrow">Setup needed</p><h1>Connect Supabase</h1><p>Set <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> in your local <code>.env</code> or hosting environment, then restart or redeploy the site. Run the migration in <code>supabase/migrations</code>. The README has step-by-step instructions.</p></div></div>`;
} else {
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');

// Read before createClient: detectSessionInUrl strips the recovery token from the URL.
let recovering = /type=recovery/.test(location.hash);

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const storagePrefix = `${config.supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${MEDIA_BUCKET}/`;
const storagePathOf = (url) => (url && url.startsWith(storagePrefix) ? decodeURIComponent(url.slice(storagePrefix.length)) : null);

async function removeMedia(urls) {
  const paths = urls.map(storagePathOf).filter(Boolean);
  if (!paths.length) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.warn('Could not remove old media', error);
}

async function uploadImage(file, folder) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use a PNG, JPG, WebP, AVIF or SVG image.');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Images must be 3 MB or smaller.');
  const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/avif': 'avif', 'image/svg+xml': 'svg' }[file.type];
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  await run(supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' }));
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// ── State and routing ─────────────────────────────────────────────────────
const state = { session: null, newSubmissions: 0, submissionFilter: 'new' };

const routes = {
  dashboard: renderDashboard,
  settings: renderSettings,
  submissions: renderSubmissions,
  ...Object.fromEntries(Object.keys(collections).map((key) => [key, () => renderCollection(key)])),
};

function currentRoute() {
  const route = location.hash.replace(/^#\/?/, '');
  return routes[route] ? route : 'dashboard';
}

async function render() {
  if (!state.session || recovering) return;
  const route = currentRoute();
  renderShell(route);
  const main = document.querySelector('#main');
  main.innerHTML = '<p class="muted">Loading…</p>';
  try {
    await routes[route](main);
  } catch (error) {
    main.innerHTML = `<div class="panel empty">Could not load this page. ${escapeHtml(error.message)}</div>`;
    console.error(error);
  }
}

function renderShell(route) {
  const link = (key, label, extra = '') => `<a href="#/${key}"${key === route ? ' aria-current="page"' : ''}>${label}${extra}</a>`;
  const badge = state.newSubmissions ? ` <span class="badge" aria-label="${state.newSubmissions} new">${state.newSubmissions}</span>` : '';
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">Silicon Motives<small>ADMIN</small></div>
        <nav class="nav" aria-label="Admin">
          ${link('dashboard', 'Dashboard')}
          ${link('submissions', 'Submissions', badge)}
          <span class="nav-group">CONTENT</span>
          ${Object.entries(collections).map(([key, c]) => link(key, c.label)).join('')}
          <span class="nav-group">SITE</span>
          ${link('settings', 'Contact & settings')}
          <a href="../" target="_blank" rel="noopener">View site ↗</a>
        </nav>
        <div class="sidebar-foot"><span>${escapeHtml(state.session.user.email)}</span><button class="btn" id="sign-out">Sign out</button></div>
      </aside>
      <main class="main" id="main"></main>
    </div>`;
  document.querySelector('#sign-out').addEventListener('click', () => supabase.auth.signOut());
}

async function refreshSubmissionCount() {
  state.newSubmissions = await run(supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'));
  const navLink = document.querySelector('.nav a[href="#/submissions"]');
  if (navLink) navLink.innerHTML = `Submissions${state.newSubmissions ? ` <span class="badge">${state.newSubmissions}</span>` : ''}`;
}

// ── Dashboard ─────────────────────────────────────────────────────────────
async function renderDashboard(main) {
  const [counts, settings] = await Promise.all([
    Promise.all(Object.keys(collections).map(async (key) => {
      const rows = await run(supabase.from(key).select('published'));
      return [key, rows.length, rows.filter((row) => row.published).length];
    })),
    run(supabase.from('site_settings').select('*').eq('id', 1).single()),
  ]);
  const byKey = Object.fromEntries(counts.map(([key, total, live]) => [key, { total, live }]));

  const todo = [];
  if (!settings.contact_email && !settings.contact_phone) todo.push('<a href="#/settings">Add a contact email or phone</a> so visitors can reach you directly.');
  if (!settings.accepting_briefs) todo.push('The website brief form is <a href="#/settings">switched off</a>; visitors can only download their brief.');
  if (!byKey.clients.live) todo.push('<a href="#/clients">Add client logos</a> to replace the “coming soon” placeholders.');
  if (!byKey.testimonials.live) todo.push('<a href="#/testimonials">Publish a testimonial</a> to replace the placeholders.');
  if (!byKey.projects.live) todo.push('<a href="#/projects">Publish a project</a> to replace the illustrative portfolio concepts.');

  main.innerHTML = `
    <div class="page-head"><div><p class="eyebrow">Overview</p><h1>Welcome back</h1><p>Changes you publish here appear on the website straight away.</p></div></div>
    <div class="stats">
      <a class="stat ${state.newSubmissions ? 'stat-alert' : ''}" href="#/submissions"><b>${state.newSubmissions}</b><span>New project briefs</span></a>
      ${Object.entries(collections).map(([key, c]) => `<a class="stat" href="#/${key}"><b>${byKey[key].live}</b><span>${c.label} published${byKey[key].total > byKey[key].live ? ` · ${byKey[key].total - byKey[key].live} hidden` : ''}</span></a>`).join('')}
    </div>
    <section class="panel panel-pad">
      <h2 style="font-size:17px;margin-bottom:10px">${todo.length ? 'Still to do' : 'All set'}</h2>
      ${todo.length ? `<ul class="checklist">${todo.map((item) => `<li>${item}</li>`).join('')}</ul>` : '<p class="muted" style="margin:0">Every section of the site has real content.</p>'}
    </section>`;
}

// ── Collections ───────────────────────────────────────────────────────────
async function loadRows(key) {
  return run(supabase.from(key).select('*').order('sort_order').order('created_at'));
}

async function renderCollection(key, main = document.querySelector('#main')) {
  const c = collections[key];
  const rows = await loadRows(key);
  main.innerHTML = `
    <div class="page-head"><div><p class="eyebrow">Content</p><h1>${c.label}</h1><p>${c.intro}</p></div><button class="btn btn-primary" id="add-row">+ Add ${c.singular}</button></div>
    <div class="panel">
      ${rows.length ? `<ul class="rows">${rows.map((row, i) => {
        const image = c.image && row[c.image];
        return `<li class="row" data-id="${row.id}">
          <span class="thumb">${image ? `<img src="${escapeHtml(image)}" alt="">` : escapeHtml(initialsOf(c.title(row)))}</span>
          <div class="row-main"><div class="row-title">${escapeHtml(c.title(row))}</div><div class="row-sub">${escapeHtml(c.subtitle(row) || '')}</div></div>
          <div class="row-actions">
            <span class="pill ${row.published ? 'pill-live' : ''}">${row.published ? 'Published' : 'Hidden'}</span>
            <button class="btn btn-icon btn-ghost" data-action="up" aria-label="Move up"${i === 0 ? ' disabled' : ''}>↑</button>
            <button class="btn btn-icon btn-ghost" data-action="down" aria-label="Move down"${i === rows.length - 1 ? ' disabled' : ''}>↓</button>
            <button class="btn" data-action="toggle">${row.published ? 'Hide' : 'Publish'}</button>
            <button class="btn" data-action="edit">Edit</button>
            <button class="btn btn-danger" data-action="delete" aria-label="Delete ${escapeHtml(c.title(row))}">Delete</button>
          </div></li>`;
      }).join('')}</ul>` : `<div class="empty">No ${c.label.toLowerCase()} yet. The website keeps showing its built-in copy until you add some.</div>`}
    </div>`;

  main.querySelector('#add-row').addEventListener('click', () => openEditor(key, null, rows));
  main.querySelectorAll('.row').forEach((el) => {
    const row = rows.find((r) => r.id === el.dataset.id);
    el.addEventListener('click', async (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      try {
        if (action === 'edit') return openEditor(key, row, rows);
        button.disabled = true;
        if (action === 'toggle') {
          await run(supabase.from(key).update({ published: !row.published }).eq('id', row.id));
          toast(row.published ? 'Hidden from the website.' : 'Published to the website.');
        } else if (action === 'delete') {
          if (!confirm(`Delete “${c.title(row)}”? This cannot be undone.`)) { button.disabled = false; return; }
          await run(supabase.from(key).delete().eq('id', row.id));
          if (c.image) await removeMedia([row[c.image]]);
          toast('Deleted.');
        } else if (action === 'up' || action === 'down') {
          await moveRow(key, rows, rows.indexOf(row), action === 'up' ? -1 : 1);
        }
        await renderCollection(key);
      } catch (error) {
        button.disabled = false;
        fail(error);
      }
    });
  });
}

async function moveRow(key, rows, index, delta) {
  const ordered = [...rows];
  const [moved] = ordered.splice(index, 1);
  ordered.splice(index + delta, 0, moved);
  // Renumber so the order is stable even if earlier rows shared a sort_order.
  await Promise.all(ordered.map((row, i) => (row.sort_order === i + 1
    ? null
    : run(supabase.from(key).update({ sort_order: i + 1 }).eq('id', row.id)))));
}

function fieldHtml(field, value) {
  const id = `f-${field.name}`;
  const help = field.help ? `<span class="field-help">${escapeHtml(field.help)}</span>` : '';
  const required = field.required ? ' required' : '';
  const max = field.max ? ` maxlength="${field.max}"` : '';
  const counter = field.max && field.type === 'textarea' ? `<span class="char-count" data-for="${id}"></span>` : '';
  switch (field.type) {
    case 'textarea':
      return `<label class="field" for="${id}">${field.label}${counter}${help}<textarea id="${id}" name="${field.name}"${required}${max}>${escapeHtml(value)}</textarea></label>`;
    case 'tags':
      return `<label class="field" for="${id}">${field.label}${help}<input type="text" id="${id}" name="${field.name}" value="${escapeHtml((value || []).join(', '))}"></label>`;
    case 'image':
      return `<div class="field"><label class="field" for="${id}" style="margin:0">${field.label}${help}</label>
        <div class="image-field" data-image-field="${field.name}">
          <div class="image-preview">${value ? `<img src="${escapeHtml(value)}" alt="">` : 'No image'}</div>
          <div class="image-controls">
            <div class="btns"><label class="btn">Upload image<input type="file" accept="${IMAGE_TYPES.join(',')}" hidden></label><button type="button" class="btn btn-danger" data-remove-image${value ? '' : ' hidden'}>Remove</button></div>
            <input type="url" id="${id}" name="${field.name}" value="${escapeHtml(value)}" placeholder="…or paste an image URL (https://)" pattern="https?://.+">
          </div>
        </div></div>`;
    default: {
      const type = field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text';
      const pattern = field.pattern ? ` pattern="${field.pattern}"` : type === 'url' ? ' pattern="https?://.+" placeholder="https://"' : '';
      return `<label class="field" for="${id}">${field.label}${help}<input type="${type}" id="${id}" name="${field.name}" value="${escapeHtml(value)}"${required}${max}${pattern}></label>`;
    }
  }
}

function readField(form, field) {
  const raw = form.elements[field.name].value.trim();
  if (field.type === 'tags') return raw.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 8);
  return raw;
}

function bindImageFields(form, folder, uploaded) {
  form.querySelectorAll('[data-image-field]').forEach((wrap) => {
    const input = form.elements[wrap.dataset.imageField];
    const preview = wrap.querySelector('.image-preview');
    const removeButton = wrap.querySelector('[data-remove-image]');
    const fileInput = wrap.querySelector('input[type=file]');
    const show = (url) => {
      preview.innerHTML = url ? `<img src="${escapeHtml(url)}" alt="">` : 'No image';
      removeButton.hidden = !url;
    };
    input.addEventListener('input', () => show(/^https?:\/\//.test(input.value) ? input.value : ''));
    removeButton.addEventListener('click', () => { input.value = ''; show(''); });
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      preview.textContent = 'Uploading…';
      try {
        const url = await uploadImage(file, folder);
        uploaded.push(url);
        input.value = url;
        show(url);
      } catch (error) {
        show(input.value);
        fail(error);
      }
    });
  });
}

function bindCounters(form) {
  form.querySelectorAll('.char-count').forEach((counter) => {
    const input = form.querySelector(`#${counter.dataset.for}`);
    const update = () => { counter.textContent = `${input.value.length} / ${input.maxLength}`; };
    input.addEventListener('input', update);
    update();
  });
}

function openEditor(key, row, rows) {
  const c = collections[key];
  const isNew = !row;
  const values = row || { ...c.defaults };
  const uploaded = [];
  let saved = false;

  editor.innerHTML = `
    <form class="editor-form" novalidate>
      <div class="editor-head"><h2 id="editor-title">${isNew ? `Add ${c.singular}` : `Edit ${c.singular}`}</h2><button type="button" class="btn btn-ghost btn-icon" data-close aria-label="Close">✕</button></div>
      <div class="editor-body">
        <p class="form-error" hidden></p>
        ${c.fields.map((field) => fieldHtml(field, values[field.name] ?? '')).join('')}
        <label class="check"><input type="checkbox" name="published"${values.published ? ' checked' : ''}> Published on the website</label>
      </div>
      <div class="editor-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">${isNew ? 'Add' : 'Save changes'}</button></div>
    </form>`;

  const form = editor.querySelector('form');
  const errorEl = form.querySelector('.form-error');
  bindImageFields(form, key, uploaded);
  bindCounters(form);
  form.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => editor.close()));

  editor.addEventListener('close', () => {
    // Discard images uploaded for an edit that was cancelled.
    if (!saved) removeMedia(uploaded);
  }, { once: true });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(c.fields.map((field) => [field.name, readField(form, field)]));
    payload.published = form.elements.published.checked;
    if (isNew) payload.sort_order = rows.reduce((max, r) => Math.max(max, r.sort_order), 0) + 1;

    const submit = form.querySelector('[type=submit]');
    submit.disabled = true;
    errorEl.hidden = true;
    try {
      if (isNew) await run(supabase.from(key).insert(payload));
      else await run(supabase.from(key).update(payload).eq('id', row.id));
      saved = true;
      const imageFields = c.fields.filter((field) => field.type === 'image').map((field) => field.name);
      const kept = new Set(imageFields.map((name) => payload[name]));
      // Remove replaced images and any uploads that did not end up being used.
      const stale = [...(isNew ? [] : imageFields.map((name) => row[name])), ...uploaded].filter((url) => url && !kept.has(url));
      await removeMedia(stale);
      editor.close();
      toast(isNew ? `${c.singular[0].toUpperCase()}${c.singular.slice(1)} added.` : 'Changes saved.');
      await renderCollection(key);
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
      submit.disabled = false;
    }
  });

  editor.showModal();
  form.querySelector('input:not([type=file]), textarea')?.focus();
}

// ── Settings ──────────────────────────────────────────────────────────────
async function renderSettings(main) {
  const settings = await run(supabase.from('site_settings').select('*').eq('id', 1).single());
  main.innerHTML = `
    <div class="page-head"><div><p class="eyebrow">Site</p><h1>Contact & settings</h1><p>Contact details appear in the “Something in mind?” section. Leave a field empty to hide it.</p></div></div>
    <form class="panel panel-pad" id="settings-form" style="max-width:640px" novalidate>
      ${settingsFields.map((field) => fieldHtml(field, settings[field.name])).join('')}
      <label class="check"><input type="checkbox" name="accepting_briefs"${settings.accepting_briefs ? ' checked' : ''}> Accept project briefs from the website</label>
      <p class="field-help" style="margin:-8px 0 20px">When on, the brief form sends submissions here. When off, visitors download their brief as a text file instead.</p>
      <button class="btn btn-primary" type="submit">Save settings</button>
      <p class="small muted" style="margin:14px 0 0">Last updated ${formatDate(settings.updated_at)}</p>
    </form>`;
  const form = main.querySelector('#settings-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(settingsFields.map((field) => [field.name, readField(form, field)]));
    payload.accepting_briefs = form.elements.accepting_briefs.checked;
    const submit = form.querySelector('[type=submit]');
    submit.disabled = true;
    try {
      await run(supabase.from('site_settings').update(payload).eq('id', 1));
      toast('Settings saved.');
      await renderSettings(main);
    } catch (error) {
      submit.disabled = false;
      fail(error);
    }
  });
}

// ── Submissions ───────────────────────────────────────────────────────────
async function renderSubmissions(main) {
  const filter = state.submissionFilter;
  let query = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(500);
  if (filter !== 'all') query = query.eq('status', filter);
  const rows = await run(query);

  main.innerHTML = `
    <div class="page-head"><div><p class="eyebrow">Inbox</p><h1>Project briefs</h1><p>Briefs sent from the website’s contact form.</p></div>${rows.length ? '<button class="btn" id="export">Export CSV</button>' : ''}</div>
    <div class="filters" role="group" aria-label="Filter by status">
      ${[...submissionStatuses, 'all'].map((status) => `<button class="btn" data-filter="${status}" aria-pressed="${status === filter}">${status[0].toUpperCase()}${status.slice(1)}</button>`).join('')}
    </div>
    <div class="panel">
      ${rows.length ? rows.map((row) => `
        <details class="submission" data-id="${row.id}">
          <summary><span class="pill pill-${row.status}">${row.status}</span><div class="row-main"><div class="row-title">${escapeHtml(row.name)}</div><div class="row-sub">${escapeHtml(row.email)} — ${escapeHtml(row.message.slice(0, 120))}</div></div><span class="date">${formatDate(row.created_at)}</span></summary>
          <div class="submission-body">
            <div class="submission-message">${escapeHtml(row.message)}</div>
            <div class="submission-actions">
              <a class="btn btn-primary" data-action="reply" href="mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent('Re: Your project brief — Silicon Motives')}">Reply by email</a>
              ${submissionStatuses.filter((s) => s !== row.status).map((s) => `<button class="btn" data-action="status" data-status="${s}">Mark ${s}</button>`).join('')}
              <button class="btn btn-danger" data-action="delete">Delete</button>
            </div>
          </div>
        </details>`).join('') : `<div class="empty">No ${filter === 'all' ? '' : `${filter} `}briefs.</div>`}
    </div>`;

  main.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    state.submissionFilter = button.dataset.filter;
    renderSubmissions(main).catch(fail);
  }));
  main.querySelector('#export')?.addEventListener('click', () => exportCsv(rows));

  main.querySelectorAll('.submission').forEach((el) => {
    const row = rows.find((r) => r.id === el.dataset.id);
    const setStatus = async (status) => {
      await run(supabase.from('contact_submissions').update({ status }).eq('id', row.id));
      row.status = status;
      const pill = el.querySelector('.pill');
      pill.className = `pill pill-${status}`;
      pill.textContent = status;
    };
    el.addEventListener('toggle', () => {
      if (el.open && row.status === 'new') setStatus('read').then(refreshSubmissionCount).catch(fail);
    });
    el.addEventListener('click', async (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      try {
        if (target.dataset.action === 'reply') {
          await setStatus('replied');
        } else if (target.dataset.action === 'status') {
          await setStatus(target.dataset.status);
          toast(`Marked ${target.dataset.status}.`);
          await renderSubmissions(main);
        } else if (target.dataset.action === 'delete') {
          if (!confirm(`Delete the brief from ${row.name}? This cannot be undone.`)) return;
          await run(supabase.from('contact_submissions').delete().eq('id', row.id));
          toast('Brief deleted.');
          await renderSubmissions(main);
        }
        await refreshSubmissionCount();
      } catch (error) {
        fail(error);
      }
    });
  });
}

function exportCsv(rows) {
  const cell = (value) => {
    let text = String(value ?? '');
    // Stop spreadsheet apps from treating text as a formula.
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const lines = [['Received', 'Name', 'Email', 'Status', 'Message'], ...rows.map((r) => [r.created_at, r.name, r.email, r.status, r.message])];
  const blob = new Blob([`﻿${lines.map((line) => line.map(cell).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: `silicon-motives-briefs-${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Authentication ────────────────────────────────────────────────────────
function renderLogin(message = '') {
  state.session = null;
  app.innerHTML = `
    <div class="auth"><form class="auth-card" id="login-form">
      <p class="eyebrow">Silicon Motives</p><h1>Admin sign in</h1><p>Sign in with your admin account.</p>
      <p class="form-error"${message ? '' : ' hidden'}>${escapeHtml(message)}</p>
      <label class="field">Email<input type="email" name="email" autocomplete="username" required></label>
      <label class="field">Password<input type="password" name="password" autocomplete="current-password" required></label>
      <button class="btn btn-primary" type="submit">Sign in</button>
      <div class="auth-links"><button type="button" class="link-btn" id="forgot">Forgot password?</button><a href="../">← Back to site</a></div>
    </form></div>`;
  const form = app.querySelector('#login-form');
  const errorEl = form.querySelector('.form-error');
  const showError = (text) => { errorEl.textContent = text; errorEl.hidden = false; };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type=submit]');
    submit.disabled = true;
    errorEl.hidden = true;
    const { error } = await supabase.auth.signInWithPassword({ email: form.elements.email.value.trim(), password: form.elements.password.value });
    if (error) {
      showError(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message);
      submit.disabled = false;
    }
  });
  form.querySelector('#forgot').addEventListener('click', async () => {
    const email = form.elements.email.value.trim();
    if (!email || !form.elements.email.checkValidity()) return showError('Enter your email address first.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}${location.pathname}` });
    if (error) return showError(error.message);
    toast('If that email has an account, a reset link is on its way.');
  });
}

function renderPasswordReset() {
  app.innerHTML = `
    <div class="auth"><form class="auth-card" id="reset-form">
      <p class="eyebrow">Silicon Motives</p><h1>Choose a new password</h1><p>Use at least 10 characters.</p>
      <p class="form-error" hidden></p>
      <label class="field">New password<input type="password" name="password" autocomplete="new-password" minlength="10" required></label>
      <button class="btn btn-primary" type="submit">Update password</button>
    </form></div>`;
  const form = app.querySelector('#reset-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const { error } = await supabase.auth.updateUser({ password: form.elements.password.value });
    if (error) {
      const errorEl = form.querySelector('.form-error');
      errorEl.textContent = error.message;
      errorEl.hidden = false;
      return;
    }
    toast('Password updated.');
    recovering = false;
    history.replaceState(null, '', location.pathname);
    startSession((await supabase.auth.getSession()).data.session);
  });
}

async function startSession(session) {
  if (recovering) return;
  if (!session) return renderLogin();
  const isAdmin = await run(supabase.rpc('is_admin')).catch(() => false);
  if (!isAdmin) {
    await supabase.auth.signOut();
    return renderLogin('This account does not have admin access.');
  }
  state.session = session;
  await refreshSubmissionCount().catch(fail);
  render();
}

supabase.auth.onAuthStateChange((event, session) => {
  // Defer so Supabase calls inside handlers don't deadlock the auth lock.
  setTimeout(() => {
    if (event === 'PASSWORD_RECOVERY') {
      recovering = true;
      renderPasswordReset();
    } else if (event === 'SIGNED_OUT') {
      renderLogin();
    } else if (event === 'SIGNED_IN' && !state.session && !recovering) {
      startSession(session);
    } else if (session && state.session) {
      state.session = session;
    }
  });
});

window.addEventListener('hashchange', render);

const { data: { session } } = await supabase.auth.getSession();
if (recovering) {
  app.innerHTML = '<p class="boot">Opening password reset…</p>';
  // An expired or invalid link never fires PASSWORD_RECOVERY; fall back to sign in.
  setTimeout(() => {
    if (recovering && !app.querySelector('#reset-form')) {
      recovering = false;
      renderLogin('That reset link is invalid or has expired. Request a new one.');
    }
  }, 5000);
} else if (!state.session) startSession(session);
}
