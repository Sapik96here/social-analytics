"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/mockData";
import { Users, Eye, TrendingUp, ThumbsUp, MessageSquare, Share2, AlertCircle } from "lucide-react";

interface FBPage {
  id: string;
  name: string;
  followers_count?: number;
  fan_count?: number;
  about?: string;
}

interface FBInsight {
  name: string;
  values: { value: number; end_time: string }[];
}

interface FBPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  likes?: { summary: { total_count: number } };
  comments?: { summary: { total_count: number } };
  shares?: { count: number };
}

interface FBData {
  page: FBPage | null;
  pageError: string | null;
  posts: FBPost[] | null;
  postsError: string | null;
  insights: FBInsight[] | null;
  insightsError: string | null;
}

function sumInsight(insights: FBInsight[] | null, name: string): number | null {
  const m = insights?.find((i) => i.name === name);
  if (!m) return null;
  return m.values.reduce((s, v) => s + (v.value || 0), 0);
}

export default function FacebookAccountView() {
  const [data, setData]       = useState<FBData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/meta/facebook")
      .then((r) => r.json())
      .then((d) => { if (d.error) { setError(d.error); return; } setData(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="bg-[#0f1320] border border-white/[0.06] rounded-xl h-24 animate-pulse" />)}
    </div>
  );

  if (error) return (
    <div className="rounded-xl p-4 flex items-start gap-2" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
      <AlertCircle size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-rose-400">Failed to load Facebook data: {error}</p>
    </div>
  );

  const page      = data?.page;
  const posts     = data?.posts ?? [];
  const insights  = data?.insights ?? null;
  const followers = page?.followers_count ?? page?.fan_count ?? null;

  const pageViews   = sumInsight(insights, "page_views_total");
  const engagements = sumInsight(insights, "page_post_engagements");
  const reactions   = sumInsight(insights, "page_actions_post_reactions_total");

  const bestPost = posts.length
    ? [...posts].sort((a, b) =>
        ((b.likes?.summary.total_count ?? 0) + (b.shares?.count ?? 0) * 2 + (b.comments?.summary.total_count ?? 0)) -
        ((a.likes?.summary.total_count ?? 0) + (a.shares?.count ?? 0) * 2 + (a.comments?.summary.total_count ?? 0))
      )[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1877F2cc, #1877F255)" }}>
          {(page?.name ?? "F")[0].toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white">{page?.name ?? "Facebook Page"}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(24,119,242,0.15)", color: "#60a5fa", border: "1px solid rgba(24,119,242,0.3)" }}>
              Facebook
            </span>
          </div>
          {page?.about && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{page.about}</p>}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Followers",       value: followers,   icon: <Users size={14} />,      color: "#60a5fa" },
          { label: "Page Views (30d)", value: pageViews,   icon: <Eye size={14} />,        color: "#a78bfa" },
          { label: "Engagements (30d)",value: engagements, icon: <TrendingUp size={14} />, color: "#34d399" },
          { label: "Reactions (30d)",  value: reactions,   icon: <ThumbsUp size={14} />,   color: "#f472b6" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color }}>{icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
            </div>
            {value !== null
              ? <p className="text-2xl font-black text-white">{formatNumber(value)}</p>
              : <p className="text-sm text-zinc-600">—</p>}
          </div>
        ))}
      </div>

      {/* Best post */}
      {bestPost && (
        <div className="bg-[#0f1320] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Best Post (by likes + shares + comments)</p>
          <div className="flex gap-4">
            {bestPost.full_picture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bestPost.full_picture} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white line-clamp-2 leading-snug mb-1">
                {bestPost.message?.split("\n")[0] ?? "No caption"}
              </p>
              <p className="text-[10px] text-zinc-500 mb-2">
                {new Date(bestPost.created_time).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs text-zinc-400"><ThumbsUp size={11} className="text-blue-400" />{formatNumber(bestPost.likes?.summary.total_count ?? 0)}</span>
                <span className="flex items-center gap-1 text-xs text-zinc-400"><MessageSquare size={11} className="text-indigo-400" />{formatNumber(bestPost.comments?.summary.total_count ?? 0)}</span>
                <span className="flex items-center gap-1 text-xs text-zinc-400"><Share2 size={11} className="text-emerald-400" />{formatNumber(bestPost.shares?.count ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts list */}
      {posts.length > 0 ? (
        <div className="bg-[#0f1320] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Recent Posts</p>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex gap-3 py-2 border-b border-white/[0.04] last:border-0">
                {post.full_picture && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.full_picture} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-snug">
                    {post.message?.split("\n")[0] ?? "—"}
                  </p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[10px] text-zinc-600">
                      {new Date(post.created_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500"><ThumbsUp size={9} />{formatNumber(post.likes?.summary.total_count ?? 0)}</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500"><Share2 size={9} />{formatNumber(post.shares?.count ?? 0)}</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500"><MessageSquare size={9} />{formatNumber(post.comments?.summary.total_count ?? 0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data?.postsError ? (
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <AlertCircle size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-400/80">Posts unavailable: {data.postsError}</p>
        </div>
      ) : null}
    </div>
  );
}
