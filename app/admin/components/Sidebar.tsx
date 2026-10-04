"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { signOut } from "../lib/data";

const MENU = [
  { heading: null, items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    heading: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: BriefcaseBusiness },
      { label: "Case studies", href: "/admin/case-studies", icon: FileText },
      { label: "Clients", href: "/admin/clients", icon: Building2 },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Capabilities", href: "/admin/services", icon: Layers },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    heading: "Site",
    items: [
      { label: "Site settings", href: "/admin/settings", icon: Settings },
      { label: "SEO", href: "/admin/seo", icon: Search },
    ],
  },
  { heading: "Inbox", items: [{ label: "Enquiries", href: "/admin/submissions", icon: Mail }] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col text-white fixed top-0 left-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M6 8h20l-7 8H6l7 8h13" stroke="white" strokeWidth="3" strokeLinejoin="round" />
              <path d="m6 8 7 8m6 0 7 8" stroke="white" strokeWidth="3" />
            </svg>
          </span>
          <span className="font-heading font-bold text-lg tracking-tight">
            Silicon<span className="text-coral">Motives</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {MENU.map((group) => (
          <div key={group.heading ?? "main"} className="pb-3">
            {group.heading && (
              <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-500">{group.heading}</p>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
