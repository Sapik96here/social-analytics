"use client";

import Link from "next/link";
import { Cinzel_Decorative } from "next/font/google";
import { ArrowRight } from "lucide-react";

const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function LandingPage() {
  return (
    <div
      className="h-screen overflow-y-scroll overflow-x-hidden"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {/* ──────────────────────────────────────────────
          SECTION 1 — Wordmark
      ────────────────────────────────────────────── */}
      <section
        className="relative h-screen flex flex-col items-center justify-center select-none overflow-hidden"
        style={{ scrollSnapAlign: "start", background: "#0e0d0b" }}
      >
        {/* Radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 35% at 50% 50%, rgba(197,160,40,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Wordmark */}
        <h1
          className={`${cinzel.className} relative z-10 text-center leading-tight tracking-widest`}
          style={{
            fontSize: "clamp(2.4rem, 8vw, 7rem)",
            background:
              "linear-gradient(160deg, #a07820 0%, #e8c84a 28%, #f5e07a 50%, #c89828 72%, #7a5510 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 36px rgba(197,160,40,0.22))",
          }}
        >
          Mad Scientist
        </h1>

        {/* Gold rule */}
        <div
          className="relative z-10 mt-6 mb-8"
          style={{
            width: "clamp(120px, 28vw, 240px)",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #c8a030, #f0d060, #c8a030, transparent)",
            opacity: 0.55,
          }}
        />

        {/* Scroll hint */}
        <p
          className={`${cinzel.className} relative z-10 text-[10px] tracking-[0.45em] uppercase`}
          style={{ color: "rgba(197,160,40,0.35)" }}
        >
          Scroll
        </p>

        {/* Animated chevron */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center"
          style={{ animation: "bounce 2s infinite" }}
        >
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(197,160,40,0.3), transparent)" }} />
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 2 — Intro
      ────────────────────────────────────────────── */}
      <section
        className="relative h-screen flex items-center overflow-hidden"
        style={{ scrollSnapAlign: "start", background: "#09080f" }}
      >
        {/* Bokeh glows */}
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Copy */}
          <div className="space-y-6">
            {/* Label */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-px" style={{ background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                Mad Scientist Studio
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight"
              style={{
                background: "linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Where data meets{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                drop culture.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-zinc-500 text-base leading-relaxed max-w-sm">
              Track performance, generate content, and spot trends before they happen — all in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "⚡ Real-time tracking", bg: "rgba(139,92,246,0.12)", color: "#a78bfa" },
                { label: "🤖 AI content ideas", bg: "rgba(6,182,212,0.12)", color: "#67e8f9" },
                { label: "📊 3 platforms", bg: "rgba(244,63,94,0.12)", color: "#fda4af" },
              ].map(({ label, bg, color }) => (
                <span
                  key={label}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: bg, color }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
            >
              Enter the Lab
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — Video placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[480px] rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "16/9",
                background: "linear-gradient(#09080f, #09080f) padding-box, linear-gradient(135deg, #8B5CF6, #06B6D4) border-box",
                border: "2px solid transparent",
              }}
            >
              {/* Dark interior */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(6,182,212,0.06) 0%, transparent 60%), #0d0c18",
                }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                  Showreel
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[9px] font-mono px-2 py-1 rounded"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                  02:34
                </span>
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Triangle */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: "14px solid rgba(255,255,255,0.7)",
                      marginLeft: 3,
                    }}
                  />
                </div>
                <p className="text-[11px] text-zinc-700 font-medium tracking-wider">Brand Story 2026</p>
              </div>

              {/* Gradient border line at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
