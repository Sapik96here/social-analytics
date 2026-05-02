"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatNumber } from "@/lib/mockData";

interface Goal {
  platform: string;
  label: string;
  goal: number;
}

interface HistoryRow {
  platform: string;
  week_label: string;
  week_date: string;
  followers: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  tiktok:              "#69C9D0",
  instagram_content:   "#E1306C",
  instagram_personal:  "#833AB4",
  facebook:            "#1877F2",
};

function GaugeArc({ pct, color }: { pct: number; color: string }) {
  const r = 44;
  const cx = 56;
  const cy = 56;
  const startAngle = -210;
  const sweep = 240;

  function polarToXY(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(fromDeg: number, toDeg: number) {
    const s = polarToXY(fromDeg);
    const e = polarToXY(toDeg);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const endAngle = startAngle + sweep * Math.min(pct, 1);

  return (
    <svg width={112} height={90} viewBox="0 0 112 90">
      {/* track */}
      <path d={arcPath(startAngle, startAngle + sweep)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} strokeLinecap="round" />
      {/* fill */}
      {pct > 0 && (
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
      )}
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MiniTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e2535] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] shadow-xl">
      <p className="text-white font-bold">{formatNumber(payload[0].value)}</p>
      <p className="text-zinc-500">{payload[0].payload.week_label}</p>
    </div>
  );
}

function PlatformCard({ goal, rows }: { goal: Goal; rows: HistoryRow[] }) {
  const color   = PLATFORM_COLORS[goal.platform] ?? "#a78bfa";
  const current = rows[rows.length - 1]?.followers ?? 0;
  const pct     = current / goal.goal;
  const pctStr  = Math.round(pct * 100) + "%";

  return (
    <div className="bg-[#0f1320] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
      {/* Gauge + label */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <GaugeArc pct={pct} color={color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 10 }}>
            <span className="text-lg font-black" style={{ color }}>{pctStr}</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{goal.label}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            <span className="font-bold text-white">{formatNumber(current)}</span>
            <span className="text-zinc-600"> / {formatNumber(goal.goal)}</span>
          </p>
          {rows.length >= 2 && (() => {
            const prev = rows[rows.length - 2].followers;
            const diff = current - prev;
            return (
              <p className="text-[10px] mt-0.5" style={{ color: diff >= 0 ? "#4ade80" : "#f87171" }}>
                {diff >= 0 ? "+" : ""}{formatNumber(diff)} this week
              </p>
            );
          })()}
        </div>
      </div>

      {/* Mini line chart */}
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={rows} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#ffffff06" vertical={false} />
          <XAxis dataKey="week_label" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip content={<MiniTooltip />} cursor={{ stroke: "#ffffff10" }} />
          <Line type="monotone" dataKey="followers" stroke={color} strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: color, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function FollowerGoalsSection() {
  const [goals, setGoals]     = useState<Goal[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/follower-data")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setGoals(d.goals ?? []);
        setHistory(d.history ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#0f1320] border border-white/[0.06] rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-xs text-rose-400">Failed to load follower data: {error}</p>;
  }

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Follower Goals</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {goals.map((g) => (
          <PlatformCard
            key={g.platform}
            goal={g}
            rows={history.filter((h) => h.platform === g.platform)}
          />
        ))}
      </div>
    </div>
  );
}
