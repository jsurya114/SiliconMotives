'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { submitIdea } from '@/lib/submit-idea.mjs';
import { ChatIcon } from '../ui/icons';
import { Button } from '../ui/Button';
import { useSmoothScroll } from '../motion/SmoothScroll';
export function IdeaForm({ label = 'Tell us about your idea' }: { label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const { lenis } = useSmoothScroll();
  useEffect(() => { setMounted(true); return () => document.body.classList.remove('dialog-open'); }, []);
  function open() { dialog.current?.showModal(); document.body.classList.add('dialog-open'); lenis()?.stop(); }
  return <>
    <Button type="button" id="open-brief" onClick={open} aria-haspopup="dialog" icon={<ChatIcon />}>{label}</Button>
    {mounted && createPortal(<dialog ref={dialog} id="brief-dialog" aria-labelledby="brief-title" className="public-site idea-dialog on-dark text-left" data-lenis-prevent onClose={() => { document.body.classList.remove('dialog-open'); lenis()?.start(); }} onClick={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.current?.close();
    }}>
      <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4"><p className="label text-lagoon">Let’s start with your idea</p><button className="grid size-11 shrink-0 place-items-center rounded-full border border-cloud/25 text-2xl" aria-label="Close idea form" onClick={() => dialog.current?.close()}>×</button></div>
      <h2 id="brief-title" className="display mt-6 text-[clamp(2.25rem,6vw,3.5rem)]">A little context.<br />A better start.</h2>
      <p className="mt-5 text-[1.0625rem] leading-[1.6] text-mist">Tell us a little about your idea. We’ll reply to your email.</p>
      <form id="brief-form" className="mt-8 grid gap-5" aria-busy={sending} onSubmit={async event => {
        event.preventDefault(); if (pending.current) return;
        const form = event.currentTarget; const data = new FormData(form);
        pending.current = true; setSending(true); setStatus('Sending your idea…');
        try {
          await submitIdea({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), message: String(data.get('project')).trim(), website: String(data.get('website') || '') });
          form.reset(); setStatus('Thank you! Your idea has been sent to our team. We’ll reply by email.');
        } catch (error) { setStatus(`Your idea could not be sent. ${(error as Error).message}`); }
        finally { pending.current = false; setSending(false); }
      }}>
        <label className="field grid gap-2"><span className="label text-cloud/90">Your name</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label>
        <label className="field grid gap-2"><span className="label text-cloud/90">Email address</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
        <label className="field grid gap-2"><span className="label text-cloud/90">What would you like to build?</span><textarea name="project" rows={4} required maxLength={5000} placeholder="Your idea, goals, and anything we should know…" /></label>
        <label className="sr-only" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="mt-2"><Button variant="lagoon" className="disabled:cursor-wait disabled:opacity-60" type="submit" disabled={sending}>Send your idea</Button></div>
        <p id="brief-status" role="status" className="min-h-6 text-[1rem] text-mist">{status}</p>
      </form>
      </div>
    </dialog>, document.body)}
  </>;
}
