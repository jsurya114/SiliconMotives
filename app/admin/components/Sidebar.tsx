"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  Mail,
  Users
} from "lucide-react";
import { removeToken } from "@/app/lib/auth";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero Content", href: "/admin/hero", icon: ImageIcon },
  { label: "Fun Fact", href: "/admin/funfact", icon: Users },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
  { label: "About Us", href: "/admin/about", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Contact Info", href: "/admin/contact-info", icon: Mail },
  { label: "Submissions", href: "/admin/submissions", icon: Mail },
  { label: "Footer", href: "/admin/footer", icon: Settings },
  { label: "SEO Settings", href: "/admin/seo", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    // In a real app, also call API logout endpoint
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col text-white fixed top-0 left-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M4 6h6c5.523 0 10 4.477 10 10s-4.477 10-10 10H4V6z" stroke="white" strokeWidth="2.5" fill="none" />
              <path d="M18 26l6-16 6 16M20.5 20h7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
          <span className="font-heading font-bold text-lg tracking-tight">
            Silicon<span className="text-coral">Motives</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-coral text-white" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
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
