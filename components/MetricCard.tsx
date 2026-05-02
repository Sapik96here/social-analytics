import { formatNumber } from "@/lib/mockData";

interface MetricCardProps {
  label: string;
  value: number;
  delta?: number; // optional vs. previous period
  icon: React.ReactNode;
  accent?: string;
}

export default function MetricCard({ label, value, delta, icon, accent = "#6366f1" }: MetricCardProps) {
  return (
    <div className="bg-[#161b27] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        <span style={{ color: accent }} className="opacity-80">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{formatNumber(value)}</p>
      {delta !== undefined && (
        <p className={`text-xs font-medium ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {delta >= 0 ? "▲" : "▼"} {formatNumber(Math.abs(delta))} vs. prev. period
        </p>
      )}
    </div>
  );
}
