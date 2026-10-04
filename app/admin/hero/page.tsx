"use client";

import { useState, useEffect, FormEvent } from "react";
import { getContent, updateContent } from "../lib/data";
import ImageUploader from "../components/ImageUploader";
import { Save, Loader2, CheckCircle } from "lucide-react";

export default function HeroEditor() {
  const [formData, setFormData] = useState({
    headline: "",
    highlightedText: "",
    subheading: "",
    ctaText: "",
    backgroundImage: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = { data: await getContent<typeof formData>("hero") };
        
        if (data.data) {
          setFormData({
            headline: data.data.headline || "",
            highlightedText: data.data.highlightedText || "",
            subheading: data.data.subheading || "",
            ctaText: data.data.ctaText || "",
            backgroundImage: data.data.backgroundImage || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch hero content", err);
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
      await updateContent("hero", formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, backgroundImage: url || "" }));
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
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-navy">Hero Section</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the main headline, buttons, and image on your homepage.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Main Headline (Top line)
                </label>
                <input
                  required
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none transition-all"
                  placeholder="Define Your"
                />
              </div>

              {/* Highlighted Text */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Highlighted Text (Bottom line, colored)
                </label>
                <input
                  required
                  type="text"
                  value={formData.highlightedText}
                  onChange={(e) => setFormData({ ...formData, highlightedText: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none transition-all"
                  placeholder="Digital Space"
                />
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Subheading
                </label>
                <textarea
                  rows={4}
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-warm-gray50 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none transition-all"
                  placeholder="We build immersive digital experiences..."
                />
              </div>
            </div>

            <div>
              {/* Image Uploader */}
              <ImageUploader 
                label="Background Image"
                recommendedSize="1920x1080px"
                value={formData.backgroundImage}
                onChange={handleImageChange}
                disableCrop={true}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-sm font-bold text-navy mb-4">Call to Action Button</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Label</h4>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1.5">Label</label>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm bg-white"
                    placeholder="Get a Quote"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
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
