'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { submitIdea } from '@/lib/submit-idea.mjs';
import { MailIcon } from './icons';
export function IdeaForm() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => { setMounted(true); return () => document.body.classList.remove('dialog-open'); }, []);
  function open() { dialog.current?.showModal(); document.body.classList.add('dialog-open'); }
  return <>
    <button className="button button-dark" id="open-brief" onClick={open}>Tell us about your idea <span aria-hidden="true"><MailIcon /></span></button>
    {mounted && createPortal(<dialog ref={dialog} id="brief-dialog" aria-labelledby="brief-title" className="text-left" onClose={() => document.body.classList.remove('dialog-open')} onClick={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.current?.close();
    }}>
      <div className="dialog-header"><p className="eyebrow">LET’S START WITH YOUR IDEA</p><button className="close-dialog" aria-label="Close idea form" onClick={() => dialog.current?.close()}>×</button></div>
      <h2 id="brief-title">A little context.<br />A better start.</h2>
      <p>Tell us a little about your idea. Your message goes straight to siliconmotives@gmail.com, and we’ll reply to your email.</p>
      <form id="brief-form" aria-busy={sending} onSubmit={async event => {
        event.preventDefault(); if (pending.current) return;
        const form = event.currentTarget; const data = new FormData(form);
        pending.current = true; setSending(true); setStatus('Sending your idea…');
        try {
          await submitIdea({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), message: String(data.get('project')).trim(), website: String(data.get('website') || '') });
          form.reset(); setStatus('Thank you! Your idea has been sent to our team. We’ll reply by email.');
        } catch (error) { setStatus(`Your idea could not be sent. ${(error as Error).message}`); }
        finally { pending.current = false; setSending(false); }
      }}>
        <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
        <label>What would you like to build?<textarea name="project" rows={4} required maxLength={5000} placeholder="Your idea, goals, and anything we should know…" /></label>
        <label className="visually-hidden" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="button button-dark disabled:cursor-wait disabled:opacity-60" type="submit" disabled={sending}>Send your idea <span aria-hidden="true"><MailIcon /></span></button>
        <p id="brief-status" role="status">{status}</p>
      </form>
    </dialog>, document.body)}
  </>;
}
