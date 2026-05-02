"use client";

import {
  Account,
  DateRange,
  filterPostsByDateRange,
  filterTimelineByDateRange,
  getAccountTotals,
  getBestPost,
  formatNumber,
  postScore,
} from "@/lib/mockData";
import FollowerGrowthChart from "./FollowerGrowthChart";
import PostThumbnail from "./PostThumbnail";
import PlatformBadge from "./PlatformBadge";
import { Eye, Share2, Bookmark, Users, TrendingUp } from "lucide-react";
import FollowerGoalsSection from "./FollowerGoalsSection";

// TODO: Replace with Meta Graph API batch requests across all connected accounts
//   Use GET /? with batch=[{method:"GET",relative_url:"{account-id}/insights?..."}] for efficiency

interface AccountCardProps {
  account: Account;
  dateRange: DateRange;
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-xs font-semibold text-zinc-200">{formatNumber(value)}</span>
    </div>
  );
}

function AccountCard({ account, dateRange }: AccountCardProps) {
  const filteredPosts = filterPostsByDateRange(account.posts, dateRange);
  const filteredTimeline = filterTimelineByDateRange(account.followerTimeline, dateRange);
  const totals = getAccountTotals(filteredPosts);
  const bestPost = getBestPost(filteredPosts);
  const isFacebook = account.platform === "facebook";

  return (
    <div className="bg-[#0f1320] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${account.profileColor}cc, ${account.profileColor}44)`,
          }}
        >
          {account.handle[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-white truncate">{account.name}</p>
            <PlatformBadge platform={account.platform} />
          </div>
          <p className="text-[11px] text-zinc-500">
            {formatNumber(account.totalFollowers)} followers
          </p>
        </div>
      </div>

      {/* Follower growth mini chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Follower Growth
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp size={10} />+{formatNumber(account.followerGrowth30d)} (30d)
          </span>
        </div>
        {filteredTimeline.length > 1 ? (
          <FollowerGrowthChart data={filteredTimeline} color={account.profileColor} />
        ) : (
          <p className="text-xs text-zinc-600 text-center py-6">Not enough data</p>
        )}
      </div>

      {/* Stats */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Period Totals
        </p>
        <StatRow icon={<Eye size={11} />} label="Views" value={totals.views} />
        <StatRow icon={<Users size={11} />} label="Reach" value={totals.reach} />
        <StatRow icon={<Share2 size={11} />} label="Shares" value={totals.shares} />
        {!isFacebook && (
          <StatRow icon={<Bookmark size={11} />} label="Saves" value={totals.saves} />
        )}
      </div>

      {/* Best post */}
      {bestPost && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Best Post
          </p>
          <div className="flex gap-3 bg-white/[0.03] rounded-xl p-3">
            <PostThumbnail color={bestPost.thumbnailColor} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-snug mb-0.5">
                {bestPost.title}
              </p>
              <p className="text-[10px] text-zinc-600 mb-1.5">
                {new Date(bestPost.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex gap-3">
                <span className="text-[10px] text-zinc-500">
                  <span className="text-zinc-300 font-semibold">{formatNumber(bestPost.views)}</span> views
                </span>
                <span className="text-[10px] text-zinc-500">
                  <span className="text-zinc-300 font-semibold">{formatNumber(bestPost.shares)}</span> shares
                </span>
                <span className="text-[10px] text-zinc-500">
                  Score: <span className="text-zinc-300 font-semibold">{formatNumber(postScore(bestPost))}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface OverviewTabProps {
  accounts: Account[];
  dateRange: DateRange;
}

export default function OverviewTab({ accounts, dateRange }: OverviewTabProps) {
  // Compute grand totals across all accounts
  const allFilteredPosts = accounts.flatMap((a) => filterPostsByDateRange(a.posts, dateRange));
  const grandTotals = getAccountTotals(allFilteredPosts);

  return (
    <div className="space-y-6">
      {/* Real follower goals from Supabase */}
      <FollowerGoalsSection />

      {/* Grand total banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: grandTotals.views, icon: <Eye size={14} /> },
          { label: "Total Reach", value: grandTotals.reach, icon: <Users size={14} /> },
          { label: "Total Shares", value: grandTotals.shares, icon: <Share2 size={14} /> },
          {
            label: "Total Followers",
            value: accounts.reduce((s, a) => s + a.totalFollowers, 0),
            icon: <TrendingUp size={14} />,
          },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-zinc-500">{icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </span>
            </div>
            <p className="text-2xl font-black text-white">{formatNumber(value)}</p>
          </div>
        ))}
      </div>

      {/* Per-account cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} dateRange={dateRange} />
        ))}
      </div>
    </div>
  );
}
