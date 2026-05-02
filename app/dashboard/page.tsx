"use client";

import { useState } from "react";
import { accounts, DateRange } from "@/lib/mockData";
import OverviewTab from "@/components/OverviewTab";
import AccountView from "@/components/AccountView";
import AppShell from "@/components/AppShell";
import { BarChart2, Camera, Globe, CalendarDays } from "lucide-react";

// TODO: Replace with Meta Graph API OAuth flow to load connected accounts dynamically.
//   Use the Facebook Login SDK to obtain a long-lived page access token, then:
//   GET /me/accounts to list pages, GET /me?fields=instagram_business_account for IG accounts.

type TabId = "overview" | "ig-official" | "ig-th" | "fb-th";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 size={14} /> },
  { id: "ig-official", label: "IG @brandname_official", icon: <Camera size={14} /> },
  { id: "ig-th", label: "IG @brandname_th", icon: <Camera size={14} /> },
  { id: "fb-th", label: "Brand Name TH", icon: <Globe size={14} /> },
];

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const activeAccount = accounts.find((a) => a.id === activeTab);

  return (
    <AppShell>
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Top nav */}
      <header className="border-b border-white/[0.06] bg-[#0a0f1a]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-indigo-400" />
            <span className="font-bold text-sm tracking-tight">Social Analytics</span>
            <span className="hidden sm:inline text-[11px] text-zinc-600 ml-1 font-medium uppercase tracking-widest">
              Internal
            </span>
          </div>

          {/* Date range selector */}
          <div className="flex items-center gap-2">
            <CalendarDays size={13} className="text-zinc-500 hidden sm:block" />
            <div className="flex bg-[#161b27] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
              {dateRangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    dateRange === opt.value
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-bold text-white">Social Media Performance</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Mock data ·{" "}
            {dateRangeOptions.find((o) => o.value === dateRange)?.label} ·{" "}
            {accounts.length} accounts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0f1320] border border-white/[0.06] rounded-xl p-1 w-fit overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const tabColor =
              tab.id === "fb-th"
                ? "text-blue-400"
                : tab.id === "overview"
                ? "text-indigo-400"
                : "text-pink-400";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#1e2740] text-white shadow border border-white/[0.08]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className={activeTab === tab.id ? tabColor : ""}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "overview" ? (
          <OverviewTab accounts={accounts} dateRange={dateRange} />
        ) : activeAccount ? (
          <AccountView account={activeAccount} dateRange={dateRange} />
        ) : null}
      </div>
    </div>
    </AppShell>
  );
}
