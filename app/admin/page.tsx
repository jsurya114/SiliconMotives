"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Briefcase, Mail } from "lucide-react";
import { getDashboardStats } from "./lib/data";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    testimonials: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(await getDashboardStats());
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Services", value: stats.services, icon: Briefcase, color: "bg-blue-100 text-blue-600" },
    { label: "Portfolio Items", value: stats.portfolio, icon: FileText, color: "bg-purple-100 text-purple-600" },
    { label: "Testimonials", value: stats.testimonials, icon: Users, color: "bg-green-100 text-green-600" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: Mail, color: "bg-coral/20 text-coral" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy">Welcome Back</h2>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your website today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-warm-gray50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">Manage Your Content</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Use the sidebar navigation to edit your website&apos;s content, update portfolio projects, or review incoming messages.
        </p>
      </div>
    </div>
  );
}
