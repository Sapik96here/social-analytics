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
import MetricCard from "./MetricCard";
import FollowerGrowthChart from "./FollowerGrowthChart";
import BestPerformingContent from "./BestPerformingContent";
import PostThumbnail from "./PostThumbnail";
import PlatformBadge from "./PlatformBadge";
import {
  Eye,
  Users,
  Share2,
  Bookmark,
  TrendingUp,
  Star,
} from "lucide-react";

// TODO: Replace all metric totals with Meta Graph API account-level insights:
//   Instagram: GET /{ig-user-id}/insights?metric=impressions,reach,follower_count&period=day
//   Facebook:  GET /{page-id}/insights?metric=page_impressions,page_reach,page_fans&period=day

interface AccountViewProps {
  account: Account;
  dateRange: DateRange;
}

export default function AccountView({ account, dateRange }: AccountViewProps) {
  const filteredPosts = filterPostsByDateRange(account.posts, dateRange);
  const filteredTimeline = filterTimelineByDateRange(account.followerTimeline, dateRange);
  const totals = getAccountTotals(filteredPosts);
  const bestPost = getBestPost(filteredPosts);
  const isFacebook = account.platform === "facebook";

  return (
    <div className="space-y-6">
      {/* Account header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${account.profileColor}cc, ${account.profileColor}55)` }}
        >
          {account.handle[0].toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">{account.name}</h2>
            <PlatformBadge platform={account.platform} />
          </div>
          <p className="text-xs text-zinc-500">
            {formatNumber(account.totalFollowers)} followers ·{" "}
            <span className="text-emerald-400">
              +{formatNumber(account.followerGrowth30d)} last 30d
            </span>
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Views"
          value={totals.views}
          icon={<Eye size={15} />}
          accent={account.profileColor}
        />
        <MetricCard
          label="Total Reach"
          value={totals.reach}
          icon={<Users size={15} />}
          accent={account.profileColor}
        />
        <MetricCard
          label="Shares"
          value={totals.shares}
          icon={<Share2 size={15} />}
          accent={account.profileColor}
        />
        {!isFacebook ? (
          <MetricCard
            label="Saves"
            value={totals.saves}
            icon={<Bookmark size={15} />}
            accent={account.profileColor}
          />
        ) : (
          <MetricCard
            label="Followers"
            value={account.totalFollowers}
            delta={account.followerGrowth30d}
            icon={<TrendingUp size={15} />}
            accent={account.profileColor}
          />
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Follower growth chart */}
        <div className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Follower Growth
          </h3>
          {filteredTimeline.length > 1 ? (
            <FollowerGrowthChart data={filteredTimeline} color={account.profileColor} />
          ) : (
            <p className="text-sm text-zinc-600 text-center py-8">Not enough data</p>
          )}
        </div>

        {/* Best post spotlight */}
        <div className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star size={13} className="text-amber-400" />
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Best Post This Period
            </h3>
          </div>
          {bestPost ? (
            <div className="flex gap-4">
              <PostThumbnail color={bestPost.thumbnailColor} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
                  {bestPost.title}
                </p>
                <p className="text-[11px] text-zinc-500 mb-3">
                  {new Date(bestPost.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Views", value: bestPost.views },
                    { label: "Shares", value: bestPost.shares },
                    ...(!isFacebook ? [{ label: "Saves", value: bestPost.saves }] : [{ label: "Reach", value: bestPost.reach }]),
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/[0.03] rounded-lg p-2 text-center">
                      <p className="text-xs font-bold text-white">{formatNumber(value)}</p>
                      <p className="text-[10px] text-zinc-600">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-600 mt-2">
                  Score:{" "}
                  <span className="text-zinc-400 font-semibold">{formatNumber(postScore(bestPost))}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-8">No posts in this date range.</p>
          )}
        </div>
      </div>

      {/* Top posts table */}
      <div className="bg-[#0f1320] border border-white/[0.06] rounded-xl p-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Top Posts — Ranked by Score (Views + 3×Shares + 2×Saves)
        </h3>
        <BestPerformingContent
          posts={filteredPosts}
          limit={6}
          showFacebook={isFacebook}
        />
      </div>
    </div>
  );
}
