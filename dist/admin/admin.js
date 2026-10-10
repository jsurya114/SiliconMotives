import { CONTENT_TYPES, safeUrl, validateContent } from '/content-model.js';
const $ = selector => document.querySelector(selector);
const state = { kind: 'projects', items: [], editing: null, deleting: null, busy: false, dirty: false, loading: false };
const editor = $('#editor');
const form = $('#editor-form');
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node; }
async function api(path, options = {}) {
  let response;
  try { response = await fetch(path, { ...options, credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...options.headers }, cache: 'no-store' }); }
  catch { throw new Error('Unable to connect. Check your connection and try again.'); }
  let result;
  try { result = await response.json(); } catch { throw new Error('The server returned an unexpected response. Please try again.'); }
  if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Sign in at /admin in another tab, then try again. Your edits are still here.' : result.error || 'Unable to complete this request.');
  return result;
}
function setBusy(busy) {
  state.busy = busy;
  form.querySelectorAll('button,input,select,textarea').forEach(node => node.disabled = busy);
}
function status(message) { $('#global-status').textContent = message; }
function render() {
  const model = CONTENT_TYPES[state.kind];
  $('#page-title').textContent = model.label;
  $('#breadcrumb').textContent = model.label;
  $('#page-description').textContent = model.description;
  $('#add-item').replaceChildren(el('span', '', '+'), document.createTextNode(` Add ${model.singular}`));
  $('#search').placeholder = `Search ${model.label.toLowerCase()}…`;
  document.querySelectorAll('#admin-nav button').forEach(button => { if (button.dataset.kind === state.kind) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
  const records = state.items.filter(item => item.kind === state.kind);
  $('#total-count').textContent = records.length;
  $('#published-count').textContent = records.filter(item => item.published).length;
  $('#draft-count').textContent = records.filter(item => !item.published).length;
  const query = $('#search').value.trim().toLowerCase();
  const filter = $('#status-filter').value;
  const shown = records.filter(item => (!query || `${item.title} ${Object.values(item.data).join(' ')}`.toLowerCase().includes(query)) && (filter === 'all' || item.published === (filter === 'published')));
  const list = $('#content-list'); list.replaceChildren();
  if (state.loading) { list.append(el('div', 'empty-state', 'Loading content…')); return; }
  if (!shown.length) {
    const empty = el('div', 'empty-state'); empty.append(el('span', 'empty-symbol', '+'), el('h2', '', records.length ? 'No matching items' : `Your ${model.label.toLowerCase()} start here.`), el('p', '', records.length ? 'Try another search or status filter.' : `Add your first ${model.singular}. Save it as a draft until you’re ready to publish.`));
    if (!records.length) { const button = el('button', 'secondary', `Add ${model.singular}`); button.addEventListener('click', () => openEditor()); empty.append(button); }
    list.append(empty); return;
  }
  shown.forEach(item => {
    const row = el('article', 'content-row');
    const imageUrl = safeUrl(item.data.image_url);
    let thumb;
    if (imageUrl) { thumb = el('img', 'row-thumb'); thumb.src = imageUrl; thumb.alt = ''; thumb.loading = 'lazy'; thumb.referrerPolicy = 'no-referrer'; thumb.addEventListener('error', () => thumb.replaceWith(el('span', 'row-thumb row-initials', item.title.slice(0,1))), { once: true }); }
    else thumb = el('span', 'row-thumb row-initials', item.title.slice(0,1));
    const main = el('div','row-main'); main.append(el('h3','',item.title),el('p','',item.data.summary || item.data.quote || item.data.answer || item.data.link_url || 'Client profile'));
    const actions = el('div', 'row-actions');
    const edit = el('button','','Edit'); edit.setAttribute('aria-label', `Edit ${item.title}`); edit.addEventListener('click', () => openEditor(item));
    const remove = el('button','remove','Delete'); remove.setAttribute('aria-label', `Delete ${item.title}`); remove.addEventListener('click', () => openDelete(item));
    actions.append(edit, remove);
    row.append(thumb, main, el('span', `badge ${item.published ? 'published' : 'draft'}`, item.published ? 'Published' : 'Draft'), el('span','row-order',`#${item.sort_order}`), actions); list.append(row);
  });
}
async function load() {
  if (state.loading) return;
  state.loading = true; $('#refresh').disabled = true; $('#list-notice').hidden = true; render();
  try { const result = await api('/api/content?scope=admin'); state.items = result.items; }
  catch(error) { $('#list-notice').textContent = error.message; $('#list-notice').hidden = false; }
  finally { state.loading = false; $('#refresh').disabled = false; render(); }
}
function updatePreview(input, preview) { const url = safeUrl(input.value.trim()); preview.hidden = !url; if (url) preview.src = url; else preview.removeAttribute('src'); }
async function uploadImage(file, input, preview, message) {
  if (!file) return;
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 2097152) { message.textContent = 'Choose a JPG, PNG, or WebP smaller than 2 MB.'; return; }
  setBusy(true); message.textContent = 'Uploading image…';
  try {
    const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('Could not read this image.')); reader.readAsDataURL(file); });
    const result = await api('/api/upload', { method: 'POST', body: JSON.stringify({ type: file.type, base64 }) });
    input.value = result.url; updatePreview(input, preview); state.dirty = true; message.textContent = 'Image uploaded. Save the item to use it.';
  } catch(error) { message.textContent = error.message; }
  finally { setBusy(false); }
}
function openEditor(item = null) {
  state.editing = item; state.dirty = false;
  const model = CONTENT_TYPES[state.kind];
  $('#editor-kind').textContent = model.label.toUpperCase();
  $('#editor-title').textContent = `${item ? 'Edit' : 'Add'} ${model.singular}`;
  $('#title-label').firstChild.textContent = model.title;
  form.elements.title.value = item?.title || '';
  form.elements.sort_order.value = item?.sort_order ?? 0;
  form.elements.published.value = String(item?.published ?? false);
  $('#editor-error').textContent = '';
  const fields = $('#editor-fields'); fields.replaceChildren();
  model.fields.forEach(field => {
    const label = el('label','',field.label); const input = el(field.type === 'textarea' ? 'textarea' : 'input'); input.name = field.key; input.required = Boolean(field.required); input.maxLength = field.max;
    if (field.type !== 'textarea') input.type = ['url','image'].includes(field.type) ? 'url' : 'text';
    input.value = item?.data[field.key] || ''; label.append(input);
    if (field.type === 'image') {
      input.placeholder = 'https://… or upload an image';
      const control = el('div','upload-control'); const file = el('input'); file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp'; file.setAttribute('aria-label', `Upload ${field.label.toLowerCase()}`); control.append(file);
      const preview = el('img','image-preview'); preview.alt = 'Selected image preview'; preview.referrerPolicy = 'no-referrer'; preview.addEventListener('error', () => { preview.hidden = true; }); updatePreview(input,preview);
      const message = el('p','upload-status'); message.setAttribute('role','status');
      file.addEventListener('change', () => uploadImage(file.files[0], input, preview, message)); input.addEventListener('change', () => updatePreview(input,preview));
      label.append(control,el('p','field-help','JPG, PNG, or WebP · up to 2 MB. Uploaded images have public URLs.'),preview,message);
    }
    fields.append(label);
  });
  editor.showModal(); form.elements.title.focus();
}
function closeEditor() {
  if (state.busy) return;
  if (state.dirty && !window.confirm('Discard your unsaved changes?')) return;
  editor.close();
}
form.addEventListener('input', () => state.dirty = true);
editor.addEventListener('cancel', event => { event.preventDefault(); closeEditor(); });
$('#close-editor').addEventListener('click', closeEditor); $('#cancel-editor').addEventListener('click', closeEditor);
form.addEventListener('submit', async event => {
  event.preventDefault(); if (state.busy) return;
  $('#editor-error').textContent = '';
  const values = new FormData(form); const data = {};
  for (const field of CONTENT_TYPES[state.kind].fields) data[field.key] = String(values.get(field.key) || '');
  let payload;
  try { payload = validateContent({ kind: state.kind, title: values.get('title'), sort_order: Number(values.get('sort_order')), published: values.get('published') === 'true', data }); }
  catch(error) { $('#editor-error').textContent = error.message; return; }
  const item = state.editing;
  if (item) payload.updated_at = item.updated_at;
  setBusy(true); $('#save-item').textContent = 'Saving…';
  try {
    const result = await api(`/api/content${item ? `?id=${item.id}` : ''}`, { method: item ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
    state.items = [...state.items.filter(record => record.id !== result.item.id), result.item].sort((a,b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));
    state.dirty = false; editor.close(); render(); status(`${result.item.title} saved as ${result.item.published ? 'published. It is now available on the website.' : 'a draft.'}`);
  } catch(error) { $('#editor-error').textContent = error.message; }
  finally { setBusy(false); $('#save-item').textContent = 'Save changes'; }
});
function openDelete(item) { state.deleting = item; $('#delete-description').textContent = item.title; $('#delete-error').textContent = ''; $('#delete-dialog').showModal(); $('#cancel-delete').focus(); }
$('#cancel-delete').addEventListener('click', () => $('#delete-dialog').close());
$('#delete-dialog').addEventListener('cancel', event => { if ($('#confirm-delete').disabled) event.preventDefault(); });
$('#confirm-delete').addEventListener('click', async () => {
  const item = state.deleting; if (!item) return;
  $('#confirm-delete').disabled = true; $('#cancel-delete').disabled = true;
  try { await api(`/api/content?id=${item.id}`, { method:'DELETE', body: JSON.stringify({ updated_at:item.updated_at }) }); state.items = state.items.filter(record => record.id !== item.id); $('#delete-dialog').close(); render(); status(`${item.title} deleted.`); }
  catch(error) { $('#delete-error').textContent = error.message; }
  finally { $('#confirm-delete').disabled = false; $('#cancel-delete').disabled = false; }
});
async function showAdmin(email) { $('#login-view').hidden = true; $('#admin-view').hidden = false; $('#admin-email').textContent = email; await load(); }
$('#login-form').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.disabled = true; $('#login-error').textContent = '';
  const values = new FormData(event.currentTarget);
  try { const result = await api('/api/auth', { method:'POST', body:JSON.stringify({ email:values.get('email'), password:values.get('password') }) }); event.target.reset(); await showAdmin(result.email); }
  catch(error) { $('#login-error').textContent = error.message; }
  finally { button.disabled = false; }
});
$('#sign-out').addEventListener('click', async () => {
  $('#sign-out').disabled = true;
  try { await api('/api/auth', { method:'DELETE', body:'{}' }); state.items = []; $('#admin-view').hidden = true; $('#login-view').hidden = false; $('#connection-notice').hidden = true; $('#login-form').hidden = false; $('#login-form input').focus(); }
  catch(error) { status(error.message); }
  finally { $('#sign-out').disabled = false; }
});
$('#add-item').addEventListener('click', () => openEditor());
$('#refresh').addEventListener('click', load);
$('#search').addEventListener('input', render); $('#status-filter').addEventListener('change', render);
$('#admin-nav').addEventListener('click', event => { const button = event.target.closest('[data-kind]'); if (!button) return; state.kind = button.dataset.kind; $('#search').value = ''; $('#status-filter').value = 'all'; status(''); render(); });
window.addEventListener('beforeunload', event => { if (editor.open && state.dirty) { event.preventDefault(); event.returnValue = ''; } });
async function init() {
  try {
    const result = await api('/api/auth');
    if (!result.configured) { $('#connection-notice').textContent = 'Your admin area is ready to connect.\nComplete the database setup in ADMIN-SETUP.md, add the environment variables in Vercel, and redeploy. Sign-in will be available once connected.'; return; }
    $('#connection-notice').hidden = true; $('#login-form').hidden = false;
    if (result.authenticated) await showAdmin(result.email);
  } catch(error) { $('#connection-notice').textContent = error.message; }
}
init();
