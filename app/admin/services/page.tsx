"use client";

import { useState, useEffect, FormEvent } from "react";
import ImageUploader from "../components/ImageUploader";
import {
  deleteService,
  listServices,
  saveService,
  type ServiceItem as Service,
} from "../lib/data";
import { 
  Loader2, Plus, Edit2, Trash2, X, Save,
  Monitor, Smartphone, Code, Paintbrush, Globe, Server, Database, Search, Zap, Layout
} from "lucide-react";

// Map of available icons for the user to choose from
const ICON_MAP: Record<string, React.ElementType> = {
  Monitor,
  Smartphone,
  Code,
  Paintbrush,
  Globe,
  Server,
  Database,
  Search,
  Zap,
  Layout
};

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Monitor", // Default icon
    image: "", // Cloudinary URL
    features: [] as string[],
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setServices(await listServices());
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon && ICON_MAP[service.icon] ? service.icon : "Monitor",
        image: service.image || "",
        features: service.features || [],
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", icon: "Monitor", image: "", features: [] });
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await deleteService(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete service.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveService(editingId, formData);
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index: number, val: string) => {
    setFormData(prev => {
      const f = [...prev.features];
      f[index] = val;
      return { ...prev, features: f };
    });
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, image: url || "" }));
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-coral" size={48} /></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-navy">Services</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the services you offer.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-coral hover:bg-coral-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="p-6">
        {services.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No services found. Add your first service!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => {
              const IconComponent = ICON_MAP[service.icon] || Monitor;
              return (
                <div key={service._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  {service.image && (
                    <div className="w-full h-32 mb-4 bg-gray-100 rounded-md overflow-hidden relative">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="w-12 h-12 bg-navy/5 text-coral rounded-lg flex items-center justify-center mb-4">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button onClick={() => handleOpenModal(service)} className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-md"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(service._id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy">{editingId ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
                  <select
                    required
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2.5 border rounded-lg bg-white"
                  >
                    {Object.keys(ICON_MAP).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              
              <div>
                <ImageUploader 
                  label="Cover Image (Optional)"
                  recommendedSize="600x800px"
                  value={formData.image}
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button type="button" onClick={addFeature} className="text-coral text-sm font-medium flex items-center gap-1"><Plus size={14}/> Add Feature</button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input required type="text" value={feat} onChange={e => updateFeature(idx, e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  {formData.features.length === 0 && <p className="text-sm text-gray-400 italic">No features added yet.</p>}
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-coral hover:bg-coral-hover text-white font-medium rounded-lg flex items-center gap-2">
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
