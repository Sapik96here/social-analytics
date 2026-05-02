import { Platform } from "@/lib/mockData";

interface PlatformBadgeProps {
  platform: Platform;
}

const config: Record<Platform, { label: string; bg: string; text: string }> = {
  instagram: { label: "Instagram", bg: "bg-pink-500/15", text: "text-pink-400" },
  facebook: { label: "Facebook", bg: "bg-blue-500/15", text: "text-blue-400" },
};

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const { label, bg, text } = config[platform];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}
