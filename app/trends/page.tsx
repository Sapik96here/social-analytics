"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { TrendingUp, Flame, Zap, BarChart2, Plus, X, Sparkles, Users, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// TODO: Replace mock analysis with real pipeline:
//   1. Fetch creator recent posts:
//      - Instagram: GET /{ig-user-id}/media?fields=caption,media_type,like_count,comments_count,timestamp (Meta Graph API)
//      - TikTok: GET /v2/research/video/query/ (TikTok Research API — requires approval)
//   2. Feed post captions + engagement data to Claude API for trend extraction
//      POST https://api.anthropic.com/v1/messages with structured prompt
//   3. Return structured JSON: themes, formats, hooks, hashtags, content ideas

type Platform = "IG" | "TT";

interface Creator {
  id: string;
  handle: string;
  platform: Platform;
}

interface TrendTheme {
  emoji: string;
  title: string;
  frequency: string;
  description: string;
  accent: string;
}

interface ContentIdea {
  title: string;
  format: string;
  platform: string;
  hook: string;
}

interface AnalysisResult {
  creators: Creator[];
  themes: TrendTheme[];
  topFormats: { label: string; pct: number; color: string }[];
  risingHashtags: { tag: string; why: string }[];
  contentIdeas: ContentIdea[];
  summary: string;
}

// Mock AI analysis results keyed by number of creators analyzed
const MOCK_ANALYSIS: AnalysisResult = {
  creators: [],
  summary:
    "Across the selected creators, short-form emotional storytelling dominates — videos under 30s with a strong hook in the first 2s consistently outperform. Raw, unpolished aesthetics are beating studio-quality content 3:1 on saves.",
  themes: [
    {
      emoji: "🎭",
      title: "Raw / Unfiltered POV",
      frequency: "68% of top posts",
      description: "Handheld, no colour grade, talking directly to camera. Audiences are fatigued by over-produced content.",
      accent: "#8B5CF6",
    },
    {
      emoji: "🔥",
      title: "Tension-Hook Opens",
      frequency: "54% of viral posts",
      description: "First frame poses a question or shows the end result first, then rewinds. Drives watch-through rate +2.4×.",
      accent: "#F43F5E",
    },
    {
      emoji: "🤝",
      title: "Duet / Collab Format",
      frequency: "3× avg reach",
      description: "Stitching or collaborating with micro-creators in the same niche is the fastest organic reach multiplier right now.",
      accent: "#06B6D4",
    },
    {
      emoji: "📖",
      title: "Story Arc in 15s",
      frequency: "+89% completion rate",
      description: "Setup → conflict → resolution compressed into 15 seconds. Saves and shares spike when the payoff feels earned.",
      accent: "#F59E0B",
    },
  ],
  topFormats: [
    { label: "Vertical Reel / TikTok (≤30s)", pct: 91, color: "#8B5CF6" },
    { label: "Talking-head POV", pct: 74, color: "#F43F5E" },
    { label: "Text-overlay Montage", pct: 58, color: "#06B6D4" },
    { label: "Before / After", pct: 43, color: "#F59E0B" },
  ],
  risingHashtags: [
    { tag: "#RawAndReal", why: "Used in 4/5 creators' top posts this week" },
    { tag: "#POVcheck", why: "Engagement rate 2.8× niche average" },
    { tag: "#Storytime", why: "Fastest growing in fashion-lifestyle vertical" },
    { tag: "#OutfitOfTheDay", why: "Cross-creator consistency — safe reach amplifier" },
    { tag: "#BehindTheDrop", why: "BTS content driving high save rates" },
    { tag: "#TrendAlert", why: "High share velocity in the last 72 hours" },
  ],
  contentIdeas: [
    {
      title: "\"I tried their exact routine for 7 days\"",
      format: "Reel ≤30s",
      platform: "IG + TT",
      hook: "Show the final result in frame 1, then cut to day 1",
    },
    {
      title: "Pack an order with me — raw warehouse BTS",
      format: "Talking-head POV",
      platform: "TikTok",
      hook: "\"You've never seen how this actually gets made\"",
    },
    {
      title: "3 looks, 1 piece — rapid outfit swap",
      format: "Text-overlay Montage",
      platform: "IG Reels",
      hook: "\"Which one are you?\" drives comment engagement",
    },
    {
      title: "Collab: style the same piece differently",
      format: "Duet / Stitch",
      platform: "TT + IG",
      hook: "Tag a creator with different aesthetic — contrast drives saves",
    },
  ],
};

const ANALYZE_STAGES = [
  "Fetching recent posts...",
  "Reading captions & engagement...",
  "Identifying content patterns...",
  "Detecting recurring hooks...",
  "Mapping hashtag clusters...",
  "Generating content ideas...",
  "Finalising report...",
];

const FORMAT_BARS = [
  { label: "Reels / Short Video", pct: 84, color: "#8B5CF6" },
  { label: "Carousel / Slideshow", pct: 61, color: "#06B6D4" },
  { label: "Static Image", pct: 38, color: "#F59E0B" },
  { label: "Live Stream", pct: 22, color: "#84CC16" },
];

const HASHTAGS = [
  { tag: "#SummerFashion", posts: "1.2M", delta: "+18%", up: true },
  { tag: "#GRWM", posts: "987K", delta: "+34%", up: true },
  { tag: "#NewDrop", posts: "876K", delta: "+12%", up: true },
  { tag: "#OutfitInspo", posts: "654K", delta: "+8%", up: true },
  { tag: "#Thrifted", posts: "543K", delta: "−3%", up: false },
  { tag: "#OOTDcheck", posts: "489K", delta: "+22%", up: true },
];

const PLATFORM_TREND = [
  { week: "W1", ig: 3.2, tiktok: 4.1, fb: 2.1 },
  { week: "W2", ig: 3.4, tiktok: 4.8, fb: 2.0 },
  { week: "W3", ig: 3.1, tiktok: 5.2, fb: 2.2 },
  { week: "W4", ig: 3.8, tiktok: 5.6, fb: 2.1 },
  { week: "W5", ig: 4.1, tiktok: 5.3, fb: 2.4 },
  { week: "W6", ig: 4.5, tiktok: 5.9, fb: 2.3 },
  { week: "W7", ig: 4.2, tiktok: 6.2, fb: 2.5 },
  { week: "W8", ig: 4.8, tiktok: 6.5, fb: 2.6 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d2e] border border-white/10 rounded-xl px-3 py-2.5 text-xs shadow-2xl">
      <p className="text-zinc-500 font-bold mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export default function TrendsPage() {
  const [creators, setCreators] = useState<Creator[]>([
    { id: "1", handle: "@hypebae", platform: "IG" },
    { id: "2", handle: "@highsnobiety", platform: "IG" },
  ]);
  const [inputHandle, setInputHandle] = useState("");
  const [inputPlatform, setInputPlatform] = useState<Platform>("IG");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function addCreator() {
    const handle = inputHandle.trim().replace(/^@/, "");
    if (!handle) return;
    setCreators((prev) => [
      ...prev,
      { id: Date.now().toString(), handle: `@${handle}`, platform: inputPlatform },
    ]);
    setInputHandle("");
    setAnalysisReady(false);
    setResult(null);
  }

  function removeCreator(id: string) {
    setCreators((prev) => prev.filter((c) => c.id !== id));
    setAnalysisReady(false);
    setResult(null);
  }

  function handleAnalyze() {
    if (creators.length === 0 || analyzing) return;
    setAnalyzing(true);
    setAnalysisReady(false);
    setStageIndex(0);
    setResult(null);

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStageIndex(i);
      if (i >= ANALYZE_STAGES.length - 1) {
        clearInterval(iv);
        setTimeout(() => {
          setAnalyzing(false);
          setAnalysisReady(true);
          setResult({ ...MOCK_ANALYSIS, creators });
        }, 600);
      }
    }, 520);
  }

  return (
    <AppShell>
      <div className="bg-[#08090f] min-h-full text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={16} className="text-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                AI-Powered
              </span>
            </div>
            <h1
              className="text-4xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Trend Radar
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Pick creators to watch — AI analyses their content and tells you what to make next.
            </p>
          </div>

          {/* ── Creator Watchlist ── */}
          <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Users size={14} className="text-violet-400" />
              <p className="text-sm font-bold text-zinc-200">Creator Watchlist</p>
              <span className="ml-auto text-[10px] text-zinc-700 bg-white/[0.04] px-2 py-0.5 rounded-full font-semibold">
                {creators.length} added
              </span>
            </div>

            {/* Add row */}
            <div className="flex gap-2 mb-4">
              {/* Platform toggle */}
              <div className="flex bg-[#161b27] border border-white/[0.06] rounded-lg p-0.5 gap-0.5 flex-shrink-0">
                {(["IG", "TT"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setInputPlatform(p)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      inputPlatform === p
                        ? p === "IG"
                          ? "bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow"
                          : "bg-[#161b27] text-white shadow border border-white/10"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    style={inputPlatform === p && p === "TT" ? { background: "#111" } : {}}
                  >
                    {p === "IG" ? "Instagram" : "TikTok"}
                  </button>
                ))}
              </div>

              {/* Handle input */}
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCreator()}
                placeholder="@creatorhandle"
                className="flex-1 bg-[#161b27] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-700 outline-none focus:border-violet-500/50 transition-colors"
              />

              <button
                onClick={addCreator}
                disabled={!inputHandle.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
                style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            {/* Creator chips */}
            {creators.length === 0 ? (
              <p className="text-xs text-zinc-700 italic py-2">No creators added yet. Add some above to start.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-5">
                {creators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      background: c.platform === "IG" ? "rgba(225,48,108,0.1)" : "rgba(139,92,246,0.1)",
                      borderColor: c.platform === "IG" ? "rgba(225,48,108,0.25)" : "rgba(139,92,246,0.25)",
                      color: c.platform === "IG" ? "#f472b6" : "#a78bfa",
                    }}
                  >
                    <span className="text-[10px] font-black opacity-60">{c.platform}</span>
                    {c.handle}
                    <button
                      onClick={() => removeCreator(c.id)}
                      className="opacity-40 hover:opacity-100 transition-opacity ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={creators.length === 0 || analyzing}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: analyzing
                  ? "rgba(139,92,246,0.15)"
                  : "linear-gradient(135deg, #8B5CF6, #06B6D4)",
                color: analyzing ? "#a78bfa" : "white",
                border: analyzing ? "1px solid rgba(139,92,246,0.3)" : "none",
              }}
            >
              {analyzing ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin"
                  />
                  <span className="text-xs">{ANALYZE_STAGES[stageIndex]}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyse {creators.length} Creator{creators.length !== 1 ? "s" : ""} with AI
                </>
              )}
            </button>
          </div>

          {/* ── AI Analysis Result ── */}
          {analysisReady && result && (
            <div className="space-y-5">
              {/* Section label */}
              <div className="flex items-center gap-3">
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.4), transparent)" }}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-500 flex items-center gap-1.5">
                  <Sparkles size={10} /> AI Report
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(270deg, rgba(6,182,212,0.4), transparent)" }}
                />
              </div>

              {/* Summary callout */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(6,182,212,0.05))",
                  borderColor: "rgba(139,92,246,0.2)",
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-2">
                  Key Insight
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">{result.summary}</p>
                <p className="text-[10px] text-zinc-700 mt-3">
                  Based on analysis of {result.creators.map((c) => c.handle).join(", ")}
                </p>
              </div>

              {/* Theme cards */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Dominant Themes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.themes.map((theme) => (
                    <div
                      key={theme.title}
                      className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-4"
                      style={{ boxShadow: `0 0 30px ${theme.accent}0a` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{theme.emoji}</span>
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${theme.accent}1a`, color: theme.accent }}
                        >
                          {theme.frequency}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{theme.title}</p>
                      <p className="text-[11px] text-zinc-600 leading-relaxed">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formats + Hashtags */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Top formats */}
                <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 size={13} className="text-violet-400" />
                    <p className="text-sm font-bold text-zinc-200">What Formats Are Winning</p>
                  </div>
                  <div className="space-y-4">
                    {result.topFormats.map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-zinc-500">{bar.label}</span>
                          <span className="text-xs font-black text-white">{bar.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${bar.pct}%`, background: bar.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rising hashtags */}
                <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Flame size={13} className="text-orange-400" />
                    <p className="text-sm font-bold text-zinc-200">Hashtags to Use Now</p>
                  </div>
                  <div className="space-y-0">
                    {result.risingHashtags.map((h) => (
                      <div
                        key={h.tag}
                        className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
                      >
                        <ChevronRight size={12} className="text-violet-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-zinc-200">{h.tag}</p>
                          <p className="text-[10px] text-zinc-700">{h.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content ideas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} className="text-yellow-400" />
                  <p className="text-sm font-bold text-zinc-300">Content Ideas for You</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.contentIdeas.map((idea) => (
                    <div
                      key={idea.title}
                      className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2"
                    >
                      <p className="text-sm font-bold text-white leading-snug">{idea.title}</p>
                      <p className="text-[11px] text-zinc-600 italic leading-relaxed">
                        Hook: {idea.hook}
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-500 font-semibold">
                          {idea.format}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-500 font-semibold">
                          {idea.platform}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── General Platform Trends (always visible) ── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/[0.04]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                General Platform Trends
              </span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Format bars */}
              <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 size={14} className="text-violet-400" />
                  <p className="text-sm font-bold text-zinc-200">Content Format Performance</p>
                </div>
                <div className="space-y-5">
                  {FORMAT_BARS.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-zinc-500">{bar.label}</span>
                        <span className="text-xs font-black text-white">{bar.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${bar.pct}%`, background: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-800 mt-5">
                  Based on avg reach across all connected accounts · Last 30 days
                </p>
              </div>

              {/* Trending hashtags */}
              <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Flame size={14} className="text-orange-400" />
                    <p className="text-sm font-bold text-zinc-200">Trending This Week</p>
                  </div>
                  <span className="text-[10px] text-zinc-700 bg-white/[0.04] px-2 py-1 rounded-full font-semibold">
                    Fashion · Lifestyle
                  </span>
                </div>
                <div className="space-y-0">
                  {HASHTAGS.map((h, i) => (
                    <div
                      key={h.tag}
                      className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-800 font-mono w-4 flex-shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-zinc-200">{h.tag}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] text-zinc-700">{h.posts}</span>
                        <span className={`text-xs font-black ${h.up ? "text-emerald-400" : "text-rose-400"}`}>
                          {h.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Platform engagement trend chart */}
          <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-5">
            <div className="mb-5">
              <p className="text-sm font-bold text-zinc-200">Platform Engagement Rate</p>
              <p className="text-xs text-zinc-700 mt-0.5">Avg engagement % · Last 8 weeks</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={PLATFORM_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#52525b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#52525b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ffffff0a" }} />
                <Legend
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: "11px", color: "#71717a", paddingTop: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="ig"
                  name="Instagram"
                  stroke="#E1306C"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#E1306C", strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="tiktok"
                  name="TikTok"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="fb"
                  name="Facebook"
                  stroke="#1877F2"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#1877F2", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
