"use client";

import { useState, useEffect, FormEvent } from "react";
import { getContent, updateContent } from "../lib/data";
import { Save, Loader2, CheckCircle, Plus, Trash2 } from "lucide-react";

export default function FunFactEditor() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stats: [] as { number: string; label: string }[],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = { data: await getContent<typeof formData>("funFact") };
        
        if (data.data) {
          setFormData({
            title: data.data.title || "",
            description: data.data.description || "",
            stats: data.data.stats || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch funfact content", err);
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
      await updateContent("funFact", formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: "", label: "" }],
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  const updateStat = (index: number, field: "number" | "label", value: string) => {
    setFormData((prev) => {
      const newStats = [...prev.stats];
      newStats[index][field] = value;
      return { ...prev, stats: newStats };
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
        <h2 className="text-lg font-bold text-navy">Fun Fact Section</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update the fun fact description and the statistics counters shown below it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Section Title
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none transition-all"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-navy">Statistics (Counters)</h3>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/10 rounded-md transition-colors"
            >
              <Plus size={16} />
              Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {formData.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 250+"
                    value={stat.number}
                    onChange={(e) => updateStat(idx, "number", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Projects Completed"
                    value={stat.label}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.stats.length === 0 && (
              <p className="text-sm text-gray-500 italic py-4">No stats added yet.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          {success && (
            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle size={16} />
              Saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-coral hover:bg-coral-hover text-white font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
