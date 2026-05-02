"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FollowerDataPoint, formatNumber } from "@/lib/mockData";

// TODO: Replace with Meta Graph API — GET /{ig-user-id}/insights?metric=follower_count&period=day
//   or  GET /{page-id}/insights?metric=page_fans&period=day
interface FollowerGrowthChartProps {
  data: FollowerDataPoint[];
  color: string;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Thin the data points for readability
function thinData(data: FollowerDataPoint[], maxPoints = 20): FollowerDataPoint[] {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0 || i === data.length - 1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e2535] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{formatDateLabel(label)}</p>
      <p className="text-white font-bold">{formatNumber(payload[0].value)} followers</p>
    </div>
  );
}

export default function FollowerGrowthChart({ data, color }: FollowerGrowthChartProps) {
  const thinned = thinData(data);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={thinned} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`lineGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => formatNumber(v)}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff15" }} />
        <Line
          type="monotone"
          dataKey="followers"
          stroke={`url(#lineGrad-${color.replace("#", "")})`}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
