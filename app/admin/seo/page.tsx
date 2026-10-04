"use client";

import { useState, useEffect, FormEvent } from "react";
import { getToken } from "@/app/lib/auth";
import { Save, Loader2, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SEOEditor() {
  const [formData, setFormData] = useState({
    titleTemplate: "",
    defaultTitle: "",
    defaultDescription: "",
    defaultKeywords: "",
    siteName: "",
    canonicalUrl: "",
    googleSiteVerification: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seo`);
        const data = await res.json();
        
        if (data.data) {
          setFormData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch seo content", err);
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
      const token = getToken();
      const res = await fetch(`${API_URL}/api/seo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update content");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-lg font-bold text-navy">SEO & Meta Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the global Search Engine Optimization tags for your website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Site Name</label>
            <input
              required
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Title Template (e.g. %s | SiliconMotives)</label>
            <input
              required
              type="text"
              value={formData.titleTemplate}
              onChange={(e) => setFormData({ ...formData, titleTemplate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-navy mb-1.5">Default Title (Homepage)</label>
            <input
              required
              type="text"
              value={formData.defaultTitle}
              onChange={(e) => setFormData({ ...formData, defaultTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-navy mb-1.5">Default Meta Description</label>
            <textarea
              required
              rows={3}
              value={formData.defaultDescription}
              onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-navy mb-1.5">Default Keywords (Comma separated)</label>
            <textarea
              required
              rows={2}
              value={formData.defaultKeywords}
              onChange={(e) => setFormData({ ...formData, defaultKeywords: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Canonical URL (Base URL)</label>
            <input
              required
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Google Site Verification Code (Optional)</label>
            <input
              type="text"
              value={formData.googleSiteVerification}
              onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
            />
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
