"use client";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle, Loader2, Save } from "lucide-react";
import { FieldInput } from "../components/fields";
import { getHomeSettings, updateHomeSettings } from "../lib/data";
import defaults from "@/content/defaults.json";

type Settings = typeof defaults.settings;

const heroFields = [
  { name: "eyebrow", label: "Positioning line", max: 80, help: "Small uppercase line above the headline." },
  { name: "line1", label: "Headline, line 1", max: 60 },
  { name: "line2", label: "Headline, line 2 (muted)", max: 60 },
  { name: "intro", label: "Intro paragraph", max: 400, textarea: true },
  { name: "primaryCtaLabel", label: "Primary button label", max: 40 },
  { name: "secondaryCtaLabel", label: "Case study link label", max: 60 },
  { name: "bottomLine", label: "Bottom line", max: 100 },
] as const;

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(defaults.settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHomeSettings()
      .then((home) => {
        const h = home as Partial<Settings>;
        setForm({
          hero: { ...defaults.settings.hero, ...(h.hero ?? {}) },
          proof: Array.isArray(h.proof) ? h.proof : defaults.settings.proof,
          contact: { ...defaults.settings.contact, ...(h.contact ?? {}) },
        });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { email, bookingUrl } = form.contact;
      if (bookingUrl && !/^https?:\/\//.test(bookingUrl)) throw new Error("Booking link must start with https://");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address");
      await updateHomeSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-navy">Site settings</h2>
        <p className="text-sm text-gray-500 mt-1">Homepage hero, the proof strip under it, and direct contact details.</p>
      </div>
      <div className="p-6 space-y-6">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Hero</h3>
        {heroFields.map((f) => (
          <FieldInput
            key={f.name}
            field={{ type: "textarea" in f ? "textarea" : "text", name: f.name, label: f.label, max: f.max, help: "help" in f ? f.help : undefined, required: f.name === "line1" }}
            value={form.hero[f.name]}
            onChange={(v) => setForm({ ...form, hero: { ...form.hero, [f.name]: String(v) } })}
          />
        ))}
        <h3 className="pt-4 border-t border-gray-100 text-sm font-bold text-navy uppercase tracking-wide">Proof strip</h3>
        <FieldInput
          field={{ type: "metrics", name: "proof", label: "Facts", help: "Up to four short, verifiable facts. Remove all to hide the strip." }}
          value={form.proof}
          onChange={(v) => setForm({ ...form, proof: v as Settings["proof"] })}
        />
        <h3 className="pt-4 border-t border-gray-100 text-sm font-bold text-navy uppercase tracking-wide">Direct contact</h3>
        <FieldInput
          field={{ type: "text", name: "email", label: "Public email", max: 254, help: "Shown beside the contact form. Leave empty to hide." }}
          value={form.contact.email}
          onChange={(v) => setForm({ ...form, contact: { ...form.contact, email: String(v).trim() } })}
        />
        <FieldInput
          field={{ type: "url", name: "bookingUrl", label: "Booking link", help: "e.g. a Calendly link. Leave empty to hide." }}
          value={form.contact.bookingUrl}
          onChange={(v) => setForm({ ...form, contact: { ...form.contact, bookingUrl: String(v).trim() } })}
        />
        {error && <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{error}</div>}
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle size={16} /> Saved
          </span>
        )}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save settings
        </button>
      </div>
    </form>
  );
}
