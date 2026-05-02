"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cinzel_Decorative } from "next/font/google";
import { LayoutDashboard, Sparkles, TrendingUp } from "lucide-react";

const cinzel = Cinzel_Decorative({ weight: "700", subsets: ["latin"], display: "swap" });

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#8B5CF6" },
  { href: "/generator", label: "Generator", icon: Sparkles, color: "#06B6D4" },
  { href: "/trends", label: "Trend Radar", icon: TrendingUp, color: "#F43F5E" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#08090f] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col bg-[#0a0a14] border-r border-white/[0.05]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.05]">
          <span
            className={`${cinzel.className} text-2xl tracking-wider`}
            style={{
              background: "linear-gradient(135deg, #a07820, #e8c84a, #c89828)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MS.
          </span>
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest mt-0.5 font-medium">
            Mad Scientist
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {NAV.map(({ href, label, icon: Icon, color }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
                style={
                  active
                    ? {
                        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                        border: `1px solid ${color}25`,
                      }
                    : {}
                }
              >
                <Icon
                  size={15}
                  style={{ color: active ? color : undefined }}
                  className={active ? "" : "group-hover:text-zinc-400 transition-colors"}
                />
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-white/[0.05] space-y-1">
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
            Internal Tool
          </p>
          <p className="text-[10px] text-zinc-800">v1.0 · Mockup</p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
    </div>
  );
}
