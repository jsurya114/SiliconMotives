"use client";

import { useState, useEffect } from "react";
import {
  deleteTestimonial,
  listTestimonials,
  setTestimonialStatus,
  type TestimonialItem as Testimonial,
} from "../lib/data";
import { Loader2, Trash2, CheckCircle } from "lucide-react";


export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setTestimonials(await listTestimonials());
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "approved" ? "pending" : "approved";
      await setTestimonialStatus(id, newStatus);
      setTestimonials(testimonials.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial forever?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-coral" size={48} /></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-navy">Testimonials</h2>
        <p className="text-sm text-gray-500 mt-1">Approve, reject, or delete client testimonials.</p>
      </div>

      <div className="p-6">
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No testimonials found.</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map(item => (
              <div key={item._id} className={`border rounded-lg p-5 flex flex-col md:flex-row gap-6 items-start ${item.status !== 'approved' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="w-16 h-16 rounded-full bg-navy text-white overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xl">
                  {item.initials}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="font-bold text-navy">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.role}</p>
                      <div className="text-coral text-sm mb-3">{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</div>
                      <p className="text-sm text-gray-700 italic">&ldquo;{item.quote}&rdquo;</p>
                    </div>
                    
                    <div className="flex gap-2 items-center shrink-0">
                      <button 
                        onClick={() => toggleStatus(item._id, item.status)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          item.status === 'approved'
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {item.status === 'approved' ? <><CheckCircle size={14}/> Approved</> : "Approve"}
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
