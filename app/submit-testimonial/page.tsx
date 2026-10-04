"use client";

import { useState, FormEvent } from "react";
import { Star, Loader2, CheckCircle, Quote } from "lucide-react";
import Link from "next/link";

export default function SubmitTestimonial() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
  });
  
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit testimonial");
      }

      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-warm-gray50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-3">Thank You!</h2>
          <p className="text-gray-500 mb-8">
            Your testimonial has been successfully submitted. We truly appreciate your feedback and support!
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-coral hover:bg-coral-hover text-white font-medium rounded-lg transition-colors">
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm-gray50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy/5 text-coral rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <Quote size={32} className="transform rotate-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-heading">
            Share Your Experience
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for working with SiliconMotives! Please share a few words about your experience with our team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-navy mb-3">
                How would you rate your experience? <span className="text-coral">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoverRating || formData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                  Full Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-coral focus:ring-1 focus:ring-coral transition-colors"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-navy mb-2">
                  Role / Company <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="CEO at TechCorp"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-coral focus:ring-1 focus:ring-coral transition-colors"
                />
              </div>
            </div>

            {/* Quote */}
            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-navy mb-2">
                Your Testimonial <span className="text-coral">*</span>
              </label>
              <textarea
                id="quote"
                required
                rows={5}
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="What did you like about working with us? How did our services impact your business?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-coral focus:ring-1 focus:ring-coral transition-colors resize-y"
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {formData.quote.length} / 1000 characters
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-navy hover:bg-navy/90 text-white font-semibold rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  "Submit Testimonial"
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                By submitting, you agree that your testimonial may be featured on our public website.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
