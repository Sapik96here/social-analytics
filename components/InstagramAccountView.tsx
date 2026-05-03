"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/mockData";
import { Heart, MessageCircle, Video, Image, TrendingUp, Users } from "lucide-react";

interface IGPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
  like_count: number;
  comments_count: number;
  thumbnail_url?: string;
  media_url?: string;
}

interface IGProfile {
  username: string;
  name: string;
  followers_count: number;
  media_count: number;
  profile_picture_url?: string;
}

export default function InstagramAccountView() {
  const [profile, setProfile] = useState<IGProfile | null>(null);
  const [posts, setPosts]     = useState<IGPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/meta/instagram")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setProfile(d.profile);
        setPosts(d.posts ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-[#0f1320] border border-white/[0.06] rounded-xl h-24 animate-pulse" />)}
    </div>
  );

  if (error) return <p className="text-xs text-rose-400">Failed to load Instagram data: {error}</p>;
  if (!profile) return null;

  const totalLikes    = posts.reduce((s, p) => s + p.like_count, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments_count, 0);
  const avgLikes      = posts.length ? Math.round(totalLikes / posts.length) : 0;
  const bestPost      = [...posts].sort((a, b) => (b.like_count + b.comments_count * 2) - (a.like_count + a.comments_count * 2))[0];

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        {profile.profile_picture_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.profile_picture_url} alt={profile.username} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-pink-500/30" />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #E1306C, #833AB4)" }}>
            {profile.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white">{profile.name}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(225,48,108,0.15)", color: "#f472b6", border: "1px solid rgba(225,48,108,0.3)" }}>Instagram</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">@{profile.username} · {formatNumber(profile.media_count)} posts</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Followers",     value: profile.followers_count, icon: <Users size={14} />,       color: "#E1306C" },
          { label: "Total Likes",   value: totalLikes,              icon: <Heart size={14} />,       color: "#f472b6" },
          { label: "Total Comments",value: totalComments,           icon: <MessageCircle size={14} />, color: "#a78bfa" },
          { label: "Avg Likes/Post",value: avgLikes,                icon: <TrendingUp size={14} />,  color: "#34d399" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color }}>{icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
            </div>
            <p className="text-2xl font-black text-white">{formatNumber(value)}</p>
          </div>
        ))}
      </div>

      {/* Best post */}
      {bestPost && (
        <div className="bg-[#0f1320] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Best Post (Recent)</p>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
              {(bestPost.thumbnail_url || bestPost.media_url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bestPost.thumbnail_url ?? bestPost.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {bestPost.media_type === "VIDEO" ? <Video size={20} className="text-zinc-600" /> : <Image size={20} className="text-zinc-600" />}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white line-clamp-2 leading-snug mb-1">
                {bestPost.caption?.split("\n")[0] ?? "No caption"}
              </p>
              <p className="text-[10px] text-zinc-500 mb-2">
                {new Date(bestPost.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs text-zinc-400"><Heart size={11} className="text-pink-400" />{formatNumber(bestPost.like_count)}</span>
                <span className="flex items-center gap-1 text-xs text-zinc-400"><MessageCircle size={11} className="text-violet-400" />{formatNumber(bestPost.comments_count)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts grid */}
      <div className="bg-[#0f1320] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Recent Posts</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {posts.map((post) => (
            <div key={post.id} className="relative group rounded-lg overflow-hidden bg-white/[0.04]" style={{ aspectRatio: "1/1" }}>
              {(post.thumbnail_url || post.media_url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.thumbnail_url ?? post.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {post.media_type === "VIDEO" ? <Video size={16} className="text-zinc-600" /> : <Image size={16} className="text-zinc-600" />}
                </div>
              )}
              {post.media_type === "VIDEO" && (
                <div className="absolute top-1 right-1">
                  <Video size={10} className="text-white drop-shadow" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <span className="flex items-center gap-1 text-[10px] text-white font-bold"><Heart size={9} /> {formatNumber(post.like_count)}</span>
                <span className="flex items-center gap-1 text-[10px] text-white"><MessageCircle size={9} /> {formatNumber(post.comments_count)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
