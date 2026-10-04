"use client";

import { useState, useEffect, FormEvent } from "react";
import { getContent, updateContent } from "../lib/data";
import { Save, Loader2, CheckCircle } from "lucide-react";

export default function ContactInfoEditor() {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    whatsappNumber: "",
    whatsappMessage: "",
    address: {
      line1: "",
      line2: "",
      line3: "",
    },
    businessHours: {
      weekday: "",
      saturday: "",
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = { data: await getContent<typeof formData>("contactInfo") };
        
        if (data.data) {
          setFormData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch contact content", err);
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
      await updateContent("contactInfo", formData);

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
        <h2 className="text-lg font-bold text-navy">Contact Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your public phone number, email, address, and WhatsApp link used across the site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy border-b pb-2">Direct Contact</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
          </div>

          {/* WhatsApp config */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy border-b pb-2">WhatsApp CTA</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number (with country code, no +)</label>
              <input
                type="text"
                placeholder="919876543210"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pre-filled Message</label>
              <input
                type="text"
                value={formData.whatsappMessage}
                onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy border-b pb-2">Office Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
              <input
                type="text"
                value={formData.address?.line1 || ""}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value }})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
              <input
                type="text"
                value={formData.address?.line2 || ""}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line2: e.target.value }})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 3</label>
              <input
                type="text"
                value={formData.address?.line3 || ""}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line3: e.target.value }})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-navy border-b pb-2">Business Hours</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekday Hours</label>
              <input
                type="text"
                value={formData.businessHours?.weekday || ""}
                onChange={(e) => setFormData({ ...formData, businessHours: { ...formData.businessHours, weekday: e.target.value }})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekend Hours</label>
              <input
                type="text"
                value={formData.businessHours?.saturday || ""}
                onChange={(e) => setFormData({ ...formData, businessHours: { ...formData.businessHours, saturday: e.target.value }})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-coral/20 outline-none"
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
