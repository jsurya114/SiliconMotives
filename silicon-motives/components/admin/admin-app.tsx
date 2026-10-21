'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { collections, settingsFields, type Field, type Row } from '@/lib/admin-model';
import { initials, safeImage, safeUrl } from '@/lib/urls';

const STATUSES = ['new', 'read', 'replied', 'archived'];
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'];
const date = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
async function run(promise: PromiseLike<{ data?: any; error?: any; count?: number | null }>) {
  const { data, error, count } = await promise; if (error) throw error; return count ?? data;
}
function errorText(error: unknown) { return error instanceof Error ? error.message : String((error as any)?.message || 'Something went wrong. Please try again.'); }
type Notify = (message: string) => void;

export function AdminApp({ config }: { config: { supabaseUrl: string; supabaseAnonKey: string } }) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [route, setRoute] = useState('dashboard');
  const [notice, setNotice] = useState('');
  const [count, setCount] = useState(0);
  const notify = useCallback((message: string) => setNotice(message), []);
  useEffect(() => {
    if (!config.supabaseUrl || !config.supabaseAnonKey) return;
    let alive = true, recovered = false;
    const recoveryLink = /type=recovery/.test(location.hash);
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    setClient(supabase);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, current) => {
      if (!alive) return;
      setSession(current);
      if (event === 'PASSWORD_RECOVERY') { recovered = true; setRecovering(true); }
      if (event === 'SIGNED_OUT') setRecovering(false);
    });
    supabase.auth.getSession().then(({ data, error }) => { if (alive) { setSession(data.session); if (error) setAuthError(error.message); } });
    const timer = setTimeout(() => { if (alive && recoveryLink && !recovered) setAuthError('That reset link is invalid or has expired. Request a new one.'); }, 5000);
    return () => { alive = false; clearTimeout(timer); subscription.unsubscribe(); supabase.auth.stopAutoRefresh(); };
  }, [config.supabaseUrl, config.supabaseAnonKey]);
  useEffect(() => {
    if (!client || !session) { setAdmin(null); return; }
    let active = true; setAdmin(null);
    run(client.rpc('is_admin')).then(result => { if (active) setAdmin(Boolean(result)); }).catch(() => { if (active) setAdmin(false); });
    return () => { active = false; };
  }, [client, session?.user.id]);
  useEffect(() => {
    const update = () => { const value = location.hash.replace(/^#\/?/, ''); setRoute(value in collections || ['dashboard', 'settings', 'submissions'].includes(value) ? value : 'dashboard'); };
    update(); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 6000); return () => clearTimeout(timer); }, [notice]);
  const refreshCount = useCallback(async () => {
    if (client) { try { setCount(await run(client.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'))); } catch (error) { notify(errorText(error)); } }
  }, [client, notify]);
  useEffect(() => { if (admin) void refreshCount(); }, [admin, refreshCount]);
  let content;
  if (!config.supabaseUrl || !config.supabaseAnonKey) content = <div className="auth"><div className="auth-card"><p className="eyebrow">Setup needed</p><h1>Connect Supabase</h1><p>Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your environment, then restart or redeploy. Run the migrations described in the README.</p></div></div>;
  else if (!client || session === undefined) content = <p className="boot">Loading admin…</p>;
  else if (recovering) content = <PasswordReset client={client} onDone={() => { setRecovering(false); history.replaceState(null, '', '/admin'); notify('Password updated.'); }} />;
  else if (!session) content = <Login client={client} message={authError} notify={notify} />;
  else if (admin === null) content = <p className="boot">Checking admin access…</p>;
  else if (!admin) content = <div className="auth"><div className="auth-card"><h1>Admin access required</h1><p>This account does not have admin access.</p><button className="btn" onClick={() => client.auth.signOut()}>Sign out</button></div></div>;
  else content = <div className="shell">
    <aside className="sidebar"><div className="brand">SiliconMotives<small>ADMIN</small></div><nav className="nav" aria-label="Admin">
      <a href="#/dashboard" aria-current={route === 'dashboard' ? 'page' : undefined}>Dashboard</a>
      <a href="#/submissions" aria-current={route === 'submissions' ? 'page' : undefined}>Submissions{count > 0 && <span className="badge">{count}</span>}</a>
      <span className="nav-group">CONTENT</span>{Object.entries(collections).map(([key, value]) => <a key={key} href={`#/${key}`} aria-current={route === key ? 'page' : undefined}>{value.label}</a>)}
      <span className="nav-group">SITE</span><a href="#/settings" aria-current={route === 'settings' ? 'page' : undefined}>Contact &amp; settings</a><a href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
    </nav><div className="sidebar-foot"><span>{session.user.email}</span><button className="btn" onClick={async () => { const {error} = await client.auth.signOut(); if (error) notify(error.message); }}>Sign out</button></div></aside>
    <main className="main" id="main" key={route}>
      {route === 'dashboard' ? <Dashboard client={client} count={count} /> : route === 'settings' ? <Settings client={client} notify={notify} /> : route === 'submissions' ? <Submissions client={client} notify={notify} refreshCount={refreshCount} /> : <CollectionView client={client} collectionKey={route} notify={notify} />}
    </main>
  </div>;
  return <><div id="app" className="min-h-screen font-sans">{content}</div><div className="toasts" role="status" aria-live="polite">{notice && <div className="toast">{notice}</div>}</div></>;
}

function Login({ client, message, notify }: { client: SupabaseClient; message: string; notify: Notify }) {
  const [error, setError] = useState(message), [busy, setBusy] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { setError(message); }, [message]);
  return <div className="auth"><form ref={form} className="auth-card" onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError(''); const data = new FormData(event.currentTarget);
    try { await run(client.auth.signInWithPassword({ email: String(data.get('email')).trim(), password: String(data.get('password')) })); }
    catch (error) { setError(errorText(error) === 'Invalid login credentials' ? 'Email or password is incorrect.' : errorText(error)); }
    finally { setBusy(false); }
  }}><p className="eyebrow">SiliconMotives</p><h1>Admin sign in</h1><p>Sign in with your admin account.</p>{error && <p className="form-error" role="alert">{error}</p>}
    <label className="field">Email<input type="email" name="email" autoComplete="username" required /></label><label className="field">Password<input type="password" name="password" autoComplete="current-password" required /></label>
    <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    <div className="auth-links"><button type="button" className="link-btn" disabled={busy} onClick={async () => {
      const input = form.current?.elements.namedItem('email') as HTMLInputElement;
      if (!input?.value || !input.reportValidity()) { setError('Enter your email address first.'); return; }
      setBusy(true); try { await run(client.auth.resetPasswordForEmail(input.value.trim(), { redirectTo: `${location.origin}/admin/` })); notify('If that email has an account, a reset link is on its way.'); } catch (error) { setError(errorText(error)); } finally { setBusy(false); }
    }}>Forgot password?</button><a href="/">← Back to site</a></div>
  </form></div>;
}
function PasswordReset({client, onDone}: {client: SupabaseClient; onDone: () => void}) {
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <div className="auth"><form className="auth-card" onSubmit={async event => { event.preventDefault(); setBusy(true); const password = String(new FormData(event.currentTarget).get('password')); try { await run(client.auth.updateUser({password})); onDone(); } catch (error) { setError(errorText(error)); } finally { setBusy(false); } }}>
    <p className="eyebrow">SiliconMotives</p><h1>Choose a new password</h1><p>Use at least 10 characters.</p>{error && <p className="form-error" role="alert">{error}</p>}
    <label className="field">New password<input type="password" name="password" autoComplete="new-password" minLength={10} required /></label><button className="btn btn-primary" disabled={busy}>Update password</button>
  </form></div>;
}

function Dashboard({client, count}: {client: SupabaseClient; count: number}) {
  const [stats, setStats] = useState<Row | null>(null), [settings, setSettings] = useState<Row>({}), [error, setError] = useState('');
  useEffect(() => { let active = true; Promise.all([Promise.all(Object.keys(collections).map(async key => { const rows = await run(client.from(key).select('published')); return [key, { total: rows.length, live: rows.filter((row: Row) => row.published).length }]; })), run(client.from('site_settings').select('*').eq('id', 1).single())]).then(([rows, settings]) => { if (active) { setStats(Object.fromEntries(rows)); setSettings(settings); } }).catch(error => { if (active) setError(errorText(error)); }); return () => { active = false; }; }, [client]);
  if (error) return <p role="alert" className="form-error">{error}</p>;
  if (!stats) return <p className="muted">Loading…</p>;
  return <><div className="page-head"><div><p className="eyebrow">Overview</p><h1>Welcome back</h1><p>Changes you publish here appear on the website straight away.</p></div></div>
    <div className="stats"><a className={`stat${count ? ' stat-alert' : ''}`} href="#/submissions"><b>{count}</b><span>New project briefs</span></a>{Object.entries(collections).map(([key, collection]) => <a key={key} className="stat" href={`#/${key}`}><b>{stats[key].live}</b><span>{collection.label} published{stats[key].total > stats[key].live && ` · ${stats[key].total - stats[key].live} hidden`}</span></a>)}</div>
    <section className="panel panel-pad"><h2 className="mb-3 text-lg">Content overview</h2><ul className="checklist">
      {!settings.accepting_briefs && <li>Admin inbox copies are <a href="#/settings">switched off</a>. Ideas still go to siliconmotives@gmail.com when SMTP is configured.</li>}
      {!stats.clients.live && <li><a href="#/clients">Add client logos</a> to replace the sample clients.</li>}
      {!stats.testimonials.live && <li><a href="#/testimonials">Publish client-approved testimonials</a> to show them on the public site.</li>}
      {!stats.projects.live && <li><a href="#/projects">Publish a project</a> to feature it in the portfolio.</li>}
      <li><a href="/" target="_blank" rel="noopener noreferrer">View your website</a></li>
    </ul></section>
  </>;
}

async function removeMedia(client: SupabaseClient, urls: string[]) {
  const prefix = `${client.storage.from('media').getPublicUrl('').data.publicUrl}`;
  const paths = [...new Set(urls.filter(url => url?.startsWith(prefix)).map(url => decodeURIComponent(url.slice(prefix.length))))];
  if (paths.length) { const {error} = await client.storage.from('media').remove(paths); if (error) console.warn('Could not remove unused media.'); }
}
async function uploadMedia(client: SupabaseClient, file: File, folder: string) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use a PNG, JPG, WebP, AVIF or SVG image.');
  if (file.size > 3 * 1024 * 1024) throw new Error('Images must be 3 MB or smaller.');
  const ext: Record<string, string> = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/avif': 'avif', 'image/svg+xml': 'svg'};
  const path = `${folder}/${crypto.randomUUID()}.${ext[file.type]}`;
  await run(client.storage.from('media').upload(path, file, {contentType: file.type, cacheControl: '31536000'}));
  return client.storage.from('media').getPublicUrl(path).data.publicUrl;
}

function CollectionView({client, collectionKey, notify}: {client: SupabaseClient; collectionKey: string; notify: Notify}) {
  const collection = collections[collectionKey];
  const [rows, setRows] = useState<Row[] | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [version, setVersion] = useState(0);
  const [editing, setEditing] = useState<Row | null | undefined>(undefined);
  useEffect(() => { let active = true; run(client.from(collectionKey).select('*').order('sort_order').order('created_at')).then(rows => { if (active) setRows(rows); }).catch(error => { if (active) setError(errorText(error)); }); return () => { active = false; }; }, [client, collectionKey, version]);
  async function act(action: string, row: Row, index: number) {
    if (!rows) return; setBusy(true);
    try {
      if (action === 'delete') {
        if (!confirm(`Delete “${collection.title(row)}”? This cannot be undone.`)) return;
        await run(client.from(collectionKey).delete().eq('id', row.id)); if (collection.image) await removeMedia(client, [row[collection.image]]); notify('Deleted.');
      } else if (action === 'toggle') { await run(client.from(collectionKey).update({published: !row.published}).eq('id', row.id)); notify(row.published ? 'Hidden from the website.' : 'Published to the website.'); }
      else {
        const ordered = [...rows]; const [moved] = ordered.splice(index, 1); ordered.splice(index + (action === 'up' ? -1 : 1), 0, moved);
        await Promise.all(ordered.map((row, i) => row.sort_order === i + 1 ? null : run(client.from(collectionKey).update({sort_order: i + 1}).eq('id', row.id))));
      }
      setVersion(value => value + 1);
    } catch (error) { notify(errorText(error)); } finally { setBusy(false); }
  }
  return <><div className="page-head"><div><p className="eyebrow">Content</p><h1>{collection.label}</h1><p>{collection.intro}</p></div><button className="btn btn-primary" onClick={() => setEditing(null)} disabled={!rows}>+ Add {collection.singular}</button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="panel">{rows === null ? <p className="empty">Loading…</p> : !rows.length ? <div className="empty">No {collection.label.toLowerCase()} yet. The website keeps its built-in copy until you add some.</div> : <ul className="rows">{rows.map((row, i) => <li className="row" key={row.id}>
      <span className="thumb">{collection.image && safeImage(row[collection.image]) ? <img src={safeImage(row[collection.image])} alt="" /> : initials(collection.title(row))}</span><div className="row-main"><div className="row-title">{collection.title(row)}</div><div className="row-sub">{collection.subtitle(row)}</div></div>
      <div className="row-actions"><span className={`pill${row.published ? ' pill-live' : ''}`}>{row.published ? 'Published' : collectionKey === 'testimonials' ? 'Draft' : 'Hidden'}</span>
        <button className="btn btn-icon btn-ghost" aria-label="Move up" disabled={busy || i === 0} onClick={() => act('up', row, i)}>↑</button><button className="btn btn-icon btn-ghost" aria-label="Move down" disabled={busy || i === rows.length - 1} onClick={() => act('down', row, i)}>↓</button>
        <button className="btn" disabled={busy} onClick={() => act('toggle', row, i)}>{row.published ? 'Hide' : 'Publish'}</button><button className="btn" disabled={busy} onClick={() => setEditing(row)}>Edit</button><button className="btn btn-danger" disabled={busy} onClick={() => act('delete', row, i)}>Delete</button>
      </div>
    </li>)}</ul>}</div>
    {editing !== undefined && rows && <Editor client={client} collectionKey={collectionKey} row={editing} rows={rows} onClose={() => setEditing(undefined)} onSaved={() => {setEditing(undefined); setVersion(value => value + 1); notify('Changes saved.');}} />}
  </>;
}

function TextField({field, value, onChange}: {field: Field; value: any; onChange: (value: string) => void}) {
  const type = ['email', 'tel', 'url'].includes(field.type) ? field.type : 'text';
  return <label className="field">{field.label}{field.max && field.type === 'textarea' && <span className="char-count">{String(value || '').length} / {field.max}</span>}{field.help && <span className="field-help">{field.help}</span>}
    {field.type === 'textarea' ? <textarea name={field.name} value={value || ''} onChange={event => onChange(event.target.value)} required={field.required} maxLength={field.max} />
      : <input name={field.name} type={type} value={value || ''} onChange={event => onChange(event.target.value)} required={field.required} maxLength={field.max} pattern={field.pattern || (type === 'url' ? 'https?://.+' : undefined)} />}
  </label>;
}
function Editor({client, collectionKey, row, rows, onClose, onSaved}: {client: SupabaseClient; collectionKey: string; row: Row | null; rows: Row[]; onClose: () => void; onSaved: () => void}) {
  const collection = collections[collectionKey];
  const [values, setValues] = useState<Row>(row || {...collection.defaults}), [error, setError] = useState(''), [saving, setSaving] = useState(false), [uploading, setUploading] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null), uploaded = useRef<string[]>([]), saved = useRef(false), active = useRef(true);
  useEffect(() => { active.current = true; dialog.current?.showModal(); return () => { active.current = false; if (!saved.current) void removeMedia(client, uploaded.current); }; }, [client]);
  const change = (key: string, value: any) => setValues(previous => ({...previous, [key]: value}));
  return <dialog ref={dialog} id="editor" aria-labelledby="editor-title" onCancel={event => { if (saving) event.preventDefault(); }} onClose={onClose}>
    <form className="editor-form" onSubmit={async event => {
      event.preventDefault(); if (saving || uploading) return; setSaving(true); setError('');
      const payload: Row = Object.fromEntries(collection.fields.map(field => [field.name, String(values[field.name] || '').trim()]));
      payload.published = Boolean(values.published);
      if (!row) payload.sort_order = rows.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;
      try {
        for (const field of collection.fields.filter(field => field.type === 'image')) if (payload[field.name] && !(field.allowLocal ? safeImage(payload[field.name]) : safeUrl(payload[field.name]))) throw new Error('Enter a valid image URL.');
        await run(row ? client.from(collectionKey).update(payload).eq('id', row.id) : client.from(collectionKey).insert(payload));
        saved.current = true;
        const imageFields = collection.fields.filter(field => field.type === 'image').map(field => field.name);
        const kept = new Set(imageFields.map(key => payload[key]));
        await removeMedia(client, [...imageFields.map(key => row?.[key]), ...uploaded.current].filter(url => url && !kept.has(url)));
        onSaved();
      } catch (error) { setError(errorText(error)); setSaving(false); }
    }}>
      <div className="editor-head"><h2 id="editor-title">{row ? 'Edit' : 'Add'} {collection.singular}</h2><button type="button" className="btn btn-ghost btn-icon" onClick={onClose} disabled={saving} aria-label="Close">✕</button></div>
      <div className="editor-body">{error && <p className="form-error" role="alert">{error}</p>}
        {collection.fields.map(field => field.type !== 'image' ? <TextField key={field.name} field={field} value={values[field.name]} onChange={value => change(field.name, value)} /> : <div className="field" key={field.name}>
          <label htmlFor={`image-${field.name}`}>{field.label}{field.help && <span className="field-help">{field.help}</span>}</label>
          <div className="image-field"><div className="image-preview">{safeImage(values[field.name]) ? <img src={safeImage(values[field.name])} alt="Preview" /> : 'No image'}</div><div className="image-controls">
            <div className="btns"><label className="btn">Upload image<input type="file" accept={IMAGE_TYPES.join(',')} hidden disabled={saving || uploading > 0} onChange={async event => {
              const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; setUploading(count => count + 1); setError('');
              try {
                const url = await uploadMedia(client, file, collectionKey);
                if (!active.current) { await removeMedia(client, [url]); return; }
                uploaded.current.push(url); change(field.name, url);
              } catch (error) { if (active.current) setError(errorText(error)); } finally { if (active.current) setUploading(count => count - 1); }
            }} /></label>{values[field.name] && <button type="button" className="btn btn-danger" onClick={() => change(field.name, '')} disabled={saving}>Remove</button>}</div>
            <input id={`image-${field.name}`} type={field.allowLocal ? 'text' : 'url'} value={values[field.name] || ''} onChange={event => change(field.name, event.target.value)} pattern={field.allowLocal ? 'https?://.+|/images/[A-Za-z0-9._/-]+' : 'https?://.+'} placeholder="…or paste an image URL" />
          </div></div>
        </div>)}
        {uploading > 0 && <p role="status">Uploading image…</p>}
        <label className="check"><input type="checkbox" checked={Boolean(values.published)} onChange={event => change('published', event.target.checked)} /> Published on the website</label>
      </div>
      <div className="editor-foot"><button type="button" className="btn" onClick={onClose} disabled={saving}>Cancel</button><button className="btn btn-primary" disabled={saving || uploading > 0}>{saving ? 'Saving…' : row ? 'Save changes' : 'Add'}</button></div>
    </form>
  </dialog>;
}

function Settings({client, notify}: {client: SupabaseClient; notify: Notify}) {
  const [values, setValues] = useState<Row | null>(null), [error, setError] = useState(''), [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; run(client.from('site_settings').select('*').eq('id', 1).single()).then(row => { if (active) setValues(row); }).catch(error => { if (active) setError(errorText(error)); }); return () => { active = false; }; }, [client]);
  return <><div className="page-head"><div><p className="eyebrow">Site</p><h1>Contact &amp; settings</h1><p>Public email enquiries go to siliconmotives@gmail.com. Phone and social links can be updated here.</p></div></div>{error && <p className="form-error" role="alert">{error}</p>}
    {values ? <form className="panel panel-pad max-w-[640px]" onSubmit={async event => { event.preventDefault(); setSaving(true); setError('');
      const payload = {...Object.fromEntries(settingsFields.map(field => [field.name, String(values[field.name] || '').trim()])), accepting_briefs: Boolean(values.accepting_briefs)};
      try { await run(client.from('site_settings').update(payload).eq('id', 1)); notify('Settings saved.'); } catch (error) { setError(errorText(error)); } finally { setSaving(false); }
    }}>{settingsFields.map(field => <TextField key={field.name} field={field} value={values[field.name]} onChange={value => setValues({...values, [field.name]: value})} />)}
      <label className="check"><input type="checkbox" checked={Boolean(values.accepting_briefs)} onChange={event => setValues({...values, accepting_briefs: event.target.checked})} /> Save website enquiries in the admin inbox</label>
      <p className="field-help mb-5">When on, emailed enquiries are also saved here. Email delivery to siliconmotives@gmail.com is independent of this setting.</p>
      <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
    </form> : !error && <p className="muted">Loading…</p>}
  </>;
}

function exportCsv(rows: Row[]) {
  const cell = (value: any) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
  const lines = [['Received', 'Name', 'Email', 'Status', 'Message'], ...rows.map(row => [row.created_at, row.name, row.email, row.status, row.message])];
  const blob = new Blob([`\uFEFF${lines.map(line => line.map(cell).join(',')).join('\r\n')}`], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `silicon-motives-briefs-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Submissions({client, notify, refreshCount}: {client: SupabaseClient; notify: Notify; refreshCount: () => Promise<void>}) {
  const [filter, setFilter] = useState('new'), [rows, setRows] = useState<Row[] | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; setRows(null); setError(''); let query = client.from('contact_submissions').select('*').order('created_at', {ascending: false}).limit(500); if (filter !== 'all') query = query.eq('status', filter); run(query).then(rows => { if (active) setRows(rows); }).catch(error => { if (active) setError(errorText(error)); }); return () => { active = false; }; }, [client, filter]);
  const reading = useRef(new Set<string>());
  async function status(row: Row, value: string) {
    try { await run(client.from('contact_submissions').update({status: value}).eq('id', row.id)); setRows(rows => rows?.map(item => item.id === row.id ? {...item, status: value} : item) || null); await refreshCount(); } catch (error) { notify(errorText(error)); }
  }
  return <><div className="page-head"><div><p className="eyebrow">Inbox</p><h1>Project briefs</h1><p>Copies of emailed enquiries, saved when the admin inbox setting is enabled.</p></div>{!!rows?.length && <button className="btn" onClick={() => exportCsv(rows)}>Export CSV</button>}</div>
    <div className="filters" role="group" aria-label="Filter by status">{[...STATUSES, 'all'].map(value => <button className="btn" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="panel">{rows === null ? <p className="empty">Loading…</p> : !rows.length ? <div className="empty">No {filter === 'all' ? '' : `${filter} `}briefs.</div> : rows.map(row => <details className="submission" key={row.id} onToggle={event => {
      if (event.currentTarget.open && row.status === 'new' && !reading.current.has(row.id)) { reading.current.add(row.id); void status(row, 'read').finally(() => reading.current.delete(row.id)); }
    }}><summary><span className={`pill pill-${row.status}`}>{row.status}</span><div className="row-main"><div className="row-title">{row.name}</div><div className="row-sub">{row.email} — {row.message.slice(0, 120)}</div></div><span className="date">{date(row.created_at)}</span></summary>
      <div className="submission-body"><div className="submission-message">{row.message}</div><div className="submission-actions">
        <a className="btn btn-primary" href={`mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent('Re: Your project brief — SiliconMotives')}`} onClick={() => void status(row, 'replied')}>Reply by email</a>
        {STATUSES.filter(value => value !== row.status).map(value => <button className="btn" key={value} disabled={busy} onClick={async () => {setBusy(true); await status(row, value); setBusy(false);}}>Mark {value}</button>)}
        <button className="btn btn-danger" disabled={busy} onClick={async () => { if (!confirm(`Delete the brief from ${row.name}? This cannot be undone.`)) return; setBusy(true); try {await run(client.from('contact_submissions').delete().eq('id', row.id)); setRows(rows => rows?.filter(item => item.id !== row.id) || null); await refreshCount(); notify('Brief deleted.');} catch (error) {notify(errorText(error));} finally {setBusy(false);} }}>Delete</button>
      </div></div>
    </details>)}</div>
  </>;
}
