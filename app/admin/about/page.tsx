"use client";

import { useState, useEffect, FormEvent } from "react";
import { getContent, updateContent } from "../lib/data";
import { Save, Loader2, CheckCircle, Plus, Trash2 } from "lucide-react";

export default function AboutEditor() {
  const [formData, setFormData] = useState({
    eyebrow: "",
    headline: "",
    paragraphs: [] as string[],
    founders: [] as { name: string; title: string; initials: string }[],
    stats: [] as { value: string; label: string }[],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = { data: await getContent<typeof formData>("about") };
        
        if (data.data) {
          setFormData({
            eyebrow: data.data.eyebrow || "",
            headline: data.data.headline || "",
            paragraphs: data.data.paragraphs || [],
            founders: data.data.founders || [],
            stats: data.data.stats || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch about content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await updateContent("about", formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Generic array updaters
  const addArrayItem = (field: keyof typeof formData, defaultObj: Record<string, unknown> | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as unknown[]), defaultObj],
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as unknown[]).filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field: keyof typeof formData, index: number, subfield: string | null, value: string) => {
    setFormData((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArray = [...(prev[field] as any[])];
      if (subfield) {
        newArray[index][subfield] = value;
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-coral" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-navy">About Section</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update the story, founders, and statistics shown in the About Us section.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Headings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Eyebrow (Small Tagline)</label>
            <input
              required
              type="text"
              value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Main Headline</label>
            <input
              required
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
        </div>

        {/* Paragraphs */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-navy">Paragraphs</h3>
            <button
              type="button"
              onClick={() => addArrayItem("paragraphs", "")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/10 rounded-md transition-colors"
            >
              <Plus size={16} /> Add Paragraph
            </button>
          </div>
          <div className="space-y-3">
            {formData.paragraphs.map((para, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <textarea
                  required
                  rows={3}
                  value={para}
                  onChange={(e) => updateArrayItem("paragraphs", idx, null, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white"
                />
                <button type="button" onClick={() => removeArrayItem("paragraphs", idx)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Founders */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-navy">Founders / Team</h3>
            <button
              type="button"
              onClick={() => addArrayItem("founders", { name: "", title: "", initials: "" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/10 rounded-md transition-colors"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.founders.map((founder, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                <button type="button" onClick={() => removeArrayItem("founders", idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={founder.name} onChange={(e) => updateArrayItem("founders", idx, "name", e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" required value={founder.title} onChange={(e) => updateArrayItem("founders", idx, "title", e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Initials (Max 2)</label>
                    <input type="text" maxLength={2} required value={founder.initials} onChange={(e) => updateArrayItem("founders", idx, "initials", e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm uppercase" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-navy">Company Stats</h3>
            <button
              type="button"
              onClick={() => addArrayItem("stats", { value: "", label: "" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/10 rounded-md transition-colors"
            >
              <Plus size={16} /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="text" required placeholder="50+" value={stat.value} onChange={(e) => updateArrayItem("stats", idx, "value", e.target.value)} className="w-24 px-3 py-2 border rounded-md text-sm" />
                <input type="text" required placeholder="Label" value={stat.label} onChange={(e) => updateArrayItem("stats", idx, "label", e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" />
                <button type="button" onClick={() => removeArrayItem("stats", idx)} className="text-red-500 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}

        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          {success && <span className="flex items-center gap-2 text-green-600 text-sm font-medium"><CheckCircle size={16} /> Saved!</span>}
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-coral hover:bg-coral-hover text-white font-medium rounded-lg transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
