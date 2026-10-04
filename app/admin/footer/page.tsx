"use client";

import { useState, useEffect, FormEvent } from "react";
import { getContent, updateContent } from "../lib/data";
import { Save, Loader2, CheckCircle } from "lucide-react";

export default function FooterEditor() {
  const [formData, setFormData] = useState({
    tagline: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = { data: await getContent<typeof formData>("footer") };
        
        if (data.data) {
          setFormData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch footer content", err);
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
      await updateContent("footer", formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
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
        <h2 className="text-lg font-bold text-navy">Footer Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update the global footer tagline and social media links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Footer Tagline</label>
          <textarea
            required
            rows={3}
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 outline-none"
          />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-navy mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Instagram URL</label>
              <input
                type="url"
                value={formData.socialLinks?.instagram || ""}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
              <input
                type="url"
                value={formData.socialLinks?.linkedin || ""}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Facebook URL</label>
              <input
                type="url"
                value={formData.socialLinks?.facebook || ""}
                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Twitter / X URL</label>
              <input
                type="url"
                value={formData.socialLinks?.twitter || ""}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
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
