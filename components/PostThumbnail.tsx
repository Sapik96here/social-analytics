interface PostThumbnailProps {
  color: string;
  size?: "sm" | "md" | "lg";
  rank?: number;
}

const sizes = {
  sm: "w-12 h-12 rounded-lg text-xs",
  md: "w-16 h-16 rounded-xl text-sm",
  lg: "w-20 h-20 rounded-xl text-base",
};

export default function PostThumbnail({ color, size = "md", rank }: PostThumbnailProps) {
  return (
    <div
      className={`${sizes[size]} flex-shrink-0 flex items-center justify-center font-bold text-white/40 relative overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
    >
      {/* Decorative lines simulating a photo thumbnail */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 left-2 right-2 h-[2px] bg-white/30 rounded" />
        <div className="absolute top-4 left-2 right-4 h-[2px] bg-white/20 rounded" />
        <div className="absolute bottom-3 left-2 right-3 h-[2px] bg-white/20 rounded" />
      </div>
      {rank !== undefined && (
        <span className="relative z-10 text-white font-black opacity-60">#{rank}</span>
      )}
    </div>
  );
}
