"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, FileText, Mail, MessageSquareQuote, Plus } from "lucide-react";
import { getDashboardStats } from "./lib/data";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError((e as Error).message));
  }, []);

  const cards = [
    { label: "Projects", value: stats?.projects, icon: BriefcaseBusiness, href: "/admin/projects" },
    { label: "Case studies", value: stats?.caseStudies, icon: FileText, href: "/admin/case-studies" },
    { label: "Testimonials to review", value: stats?.pendingTestimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { label: "Unread enquiries", value: stats?.unreadContacts, icon: Mail, href: "/admin/submissions" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy">Welcome back</h2>
        <p className="text-gray-500 mt-1">Manage projects, case studies, clients and testimonials. Changes appear on the site within a minute.</p>
      </div>
      {error && <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors">
            <span className="w-11 h-11 rounded-lg bg-gray-100 text-navy flex items-center justify-center flex-shrink-0">
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-sm text-gray-500">{label}</span>
              {stats ? (
                <span className="block text-2xl font-bold text-navy mt-0.5">{value}</span>
              ) : (
                <span className="block h-7 w-12 bg-gray-200 animate-pulse rounded mt-1" />
              )}
            </span>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-navy">Quick actions</h3>
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            ["Add a project", "/admin/projects"],
            ["Edit the case study", "/admin/case-studies"],
            ["Add a client", "/admin/clients"],
            ["Add a testimonial", "/admin/testimonials"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-navy hover:bg-gray-50">
              <Plus size={15} /> {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
