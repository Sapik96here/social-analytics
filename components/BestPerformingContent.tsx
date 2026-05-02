import { Post, formatNumber, postScore } from "@/lib/mockData";
import PostThumbnail from "./PostThumbnail";
import { Eye, Share2, Bookmark, Heart, MessageCircle } from "lucide-react";

// TODO: Replace with Meta Graph API — ranked by combining impressions + shares + saves
//   Instagram: GET /{ig-media-id}/insights?metric=impressions,reach,saved,shares
//   Facebook:  GET /{post-id}/insights?metric=post_impressions,post_shares

interface BestPerformingContentProps {
  posts: Post[];
  limit?: number;
  showFacebook?: boolean;
}

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-zinc-400">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-zinc-300 font-medium">{formatNumber(value)}</span>
      <span className="text-zinc-600">{label}</span>
    </div>
  );
}

export default function BestPerformingContent({
  posts,
  limit = 5,
  showFacebook = false,
}: BestPerformingContentProps) {
  const ranked = [...posts].sort((a, b) => postScore(b) - postScore(a)).slice(0, limit);

  if (!ranked.length) {
    return (
      <p className="text-sm text-zinc-500 py-6 text-center">
        No posts in this date range.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {ranked.map((post, idx) => (
        <div
          key={post.id}
          className="flex items-center gap-3 bg-[#161b27] hover:bg-[#1c2235] transition-colors border border-white/[0.05] rounded-xl p-3"
        >
          <PostThumbnail color={post.thumbnailColor} size="md" rank={idx + 1} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-snug mb-1">
              {post.title}
            </p>
            <p className="text-[11px] text-zinc-500 mb-2">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <StatPill icon={<Eye size={11} />} value={post.views} label="views" />
              <StatPill icon={<Share2 size={11} />} value={post.shares} label="shares" />
              {!showFacebook && (
                <StatPill icon={<Bookmark size={11} />} value={post.saves} label="saves" />
              )}
              <StatPill icon={<Heart size={11} />} value={post.likes} label="likes" />
              <StatPill icon={<MessageCircle size={11} />} value={post.comments} label="comments" />
            </div>
          </div>

          {/* Score badge */}
          <div className="flex-shrink-0 text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Score</p>
            <p className="text-sm font-black text-zinc-300">{formatNumber(postScore(post))}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
