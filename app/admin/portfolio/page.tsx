"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  deletePortfolio,
  listPortfolio,
  savePortfolio,
  type PortfolioItem,
} from "../lib/data";
import ImageUploader from "../components/ImageUploader";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";


export default function PortfolioEditor() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    clientName: "",
    image: "",
    link: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolio = async () => {
    try {
      setPortfolio(await listPortfolio());
    } catch (err) {
      console.error("Failed to fetch portfolio", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title,
        category: item.category,
        clientName: item.clientName || "",
        image: item.image,
        link: item.link || "",
        description: item.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        clientName: "",
        category: "",
        image: "",
        link: "",
        description: "",
      });
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?"))
      return;

    try {
      await deletePortfolio(id);
      setPortfolio(portfolio.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await savePortfolio(editingId, formData);
      await fetchPortfolio();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-coral" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-navy">Portfolio</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your project showcase.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-coral hover:bg-coral-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="p-6">
        {portfolio.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No portfolio items found. Add your first project!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 bg-gray-100 relative">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-coral uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-navy mt-1">{item.title}</h3>
                  <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy">
                {editingId ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Project Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g. Web App"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                    placeholder="Short description of the project (max 500 characters)"
                    maxLength={500}
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Live Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy mb-3">
                    Client / company name (optional)
                    <input
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      maxLength={150}
                      className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200"
                      placeholder="Published in the homepage client section"
                    />
                  </label>
                  <ImageUploader
                    label="Project Image"
                    recommendedSize="800x600px"
                    value={formData.image}
                    onChange={(url) =>
                      setFormData({ ...formData, image: url || "" })
                    }
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-coral text-white font-medium rounded-lg flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}{" "}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
