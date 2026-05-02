"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE OVERVIEW (when connecting real services):
//
// Step 1 — Upload .docx
//   TODO: POST /api/extract-script (FormData) — use mammoth.js server-side
//   Returns: { text: string, wordCount: number }
//
// Step 2 — Review & edit script, then generate audio
//   TODO: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
//   Headers: { xi-api-key: ELEVENLABS_API_KEY, Content-Type: application/json }
//   Body: { text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }
//   Returns: audio/mpeg stream → save blob → create object URL
//
// Step 3 — Preview audio, then kick off HeyGen video
//   TODO: POST https://api.heygen.com/v2/video/generate
//   Headers: { X-Api-Key: HEYGEN_API_KEY }
//   Body: { video_inputs: [{ character: { type: "avatar", avatar_id: YOUR_AVATAR_ID, avatar_style: "normal" },
//             voice: { type: "audio", audio_url: <ElevenLabs audio URL> } }],
//           dimension: { width: 1920, height: 1080 } }
//   Returns: { video_id }
//
// Step 4 — Poll until ready, then download
//   TODO: GET https://api.heygen.com/v1/video_status.get?video_id={video_id}  (poll every 5s)
//   Returns: { status: "processing" | "completed" | "failed", video_url: string }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import {
  Upload, FileText, Mic, Video, Download,
  Check, ChevronRight, RefreshCw, Play, Pause, AlertCircle,
} from "lucide-react";

// Mock script — TODO: replace with real mammoth.js extraction from uploaded .docx
const MOCK_SCRIPT = `Welcome to Mad Scientist Studio — where data meets drop culture.

In today's fast-moving social landscape, brands need more than just a presence. They need an edge.

Our platform gives you real-time analytics across Instagram, TikTok, and Facebook — so you always know what's working, and what's not.

From automated content generation to trend analysis, we help you move faster, create smarter, and grow your audience like a scientist would.

Mad Scientist Studio. Built for the bold.`;

const WAVEFORM = [4, 10, 18, 8, 22, 14, 20, 6, 24, 12, 8, 26, 18, 10, 22, 12, 16, 8, 24, 18, 10, 20, 6, 22, 14];

// HeyGen render status messages — TODO: replace with real poll responses
const STATUS_MSGS = [
  "Initialising HeyGen render…",
  "Loading avatar: Brand Avatar v2…",
  "Syncing audio to avatar…",
  "Rendering frames…",
  "Processing lip sync…",
  "Colour grading…",
  "Finalising video…",
  "Almost there…",
];

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Upload",  icon: Upload   },
  { id: 2, label: "Script",  icon: FileText },
  { id: 3, label: "Audio",   icon: Mic      },
  { id: 4, label: "Video",   icon: Video    },
] as const;

export default function GeneratorPage() {
  const [step, setStep]               = useState<Step>(1);
  const [fileName, setFileName]       = useState<string | null>(null);
  const [script, setScript]           = useState(MOCK_SCRIPT);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioReady, setAudioReady]   = useState(false);
  const [audioUrl, setAudioUrl]       = useState<string | null>(null);
  const [audioError, setAudioError]   = useState<string | null>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoLoading, setVideoLoading]   = useState(false);
  const [videoReady, setVideoReady]       = useState(false);
  const [statusMsg, setStatusMsg]     = useState(STATUS_MSGS[0]);
  const [isDragging, setIsDragging]   = useState(false);
  const fileRef  = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const wordCount  = script.trim().split(/\s+/).length;
  const estSecs    = Math.round((wordCount / 130) * 60);
  const estDur     = `${Math.floor(estSecs / 60)}:${String(estSecs % 60).padStart(2, "0")}`;
  const charCount  = script.replace(/\s/g, "").length;

  async function handleGenerateAudio() {
    setAudioLoading(true);
    setAudioError(null);
    setStep(3);
    try {
      const res = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `ElevenLabs error ${res.status}`);
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioLoading(false);
      setAudioReady(true);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : String(err));
      setAudioLoading(false);
    }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  // TODO: Replace with real HeyGen API call + polling (see header comment)
  function handleGenerateVideo() {
    setVideoLoading(true);
    setVideoProgress(0);
    setStep(4);
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 3.5 + 0.5;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        setVideoProgress(100);
        setTimeout(() => { setVideoLoading(false); setVideoReady(true); }, 500);
        return;
      }
      setVideoProgress(Math.round(pct));
      setStatusMsg(STATUS_MSGS[Math.min(Math.floor((pct / 100) * STATUS_MSGS.length), STATUS_MSGS.length - 1)]);
    }, 700);
  }

  function handleReset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setStep(1); setFileName(null); setScript(MOCK_SCRIPT);
    setAudioLoading(false); setAudioReady(false); setAudioUrl(null); setAudioError(null); setIsPlaying(false);
    setVideoProgress(0); setVideoLoading(false); setVideoReady(false);
  }

  return (
    <AppShell>
      <div className="bg-[#08090f] min-h-full text-white">
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* ── Header ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Video size={16} className="text-violet-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                Video Studio
              </span>
            </div>
            <h1
              className="text-4xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Content Generator
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Script → Voice → Avatar → Download. Done.
            </p>
          </div>

          {/* ── Step indicator ── */}
          <div className="flex items-center mb-10">
            {STEPS.map((s, i) => {
              const done   = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
                      style={
                        done   ? { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid #8B5CF640" }
                      : active ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#fff" }
                      :          { background: "rgba(255,255,255,0.04)", color: "#3f3f46", border: "1px solid rgba(255,255,255,0.05)" }
                      }
                    >
                      {done ? <Check size={13} /> : s.id}
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wide ${
                      active ? "text-zinc-300" : done ? "text-violet-500" : "text-zinc-700"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-px mx-2 mb-5 transition-all duration-500"
                      style={{ background: step > s.id ? "linear-gradient(90deg, #8B5CF6, #06B6D4)" : "rgba(255,255,255,0.05)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════
              STEP 1 — Upload Document
          ══════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-4">
              {/* TODO: Replace with real /api/extract-script endpoint using mammoth.js */}
              <input
                ref={fileRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />

              {!fileName ? (
                <div
                  className="border-2 border-dashed rounded-2xl p-16 flex flex-col items-center gap-5 cursor-pointer transition-all"
                  style={{
                    borderColor: isDragging ? "#8B5CF6" : "rgba(255,255,255,0.07)",
                    background:  isDragging ? "rgba(139,92,246,0.05)" : "rgba(255,255,255,0.01)",
                  }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e)  => { e.preventDefault(); setIsDragging(true);  }}
                  onDragLeave={()  => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setIsDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) setFileName(f.name);
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    <Upload size={26} className="text-violet-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-zinc-300">Drop your script here</p>
                    <p className="text-xs text-zinc-700">
                      Supports <span className="text-zinc-500">.docx</span> · Max 10 MB
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-4 py-2 rounded-xl"
                    style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    Browse Files
                  </span>
                </div>
              ) : (
                <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
                    >
                      <FileText size={20} className="text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{fileName}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">Word Document · Ready to extract</p>
                    </div>
                    <button
                      onClick={() => setFileName(null)}
                      className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                  >
                    Extract Script <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              STEP 2 — Review Script
          ══════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
                >
                  <Mic size={11} />
                  DAVID AI VOICE NEW
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}
                >
                  ElevenLabs API
                </span>
              </div>

              {/* Editable script */}
              {/* TODO: Pre-populate with real extracted text from mammoth.js via /api/extract-script */}
              <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">Script</span>
                  <span className="text-[10px] text-zinc-800">{fileName}</span>
                </div>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full bg-transparent px-5 py-4 text-sm text-zinc-300 leading-relaxed resize-none focus:outline-none"
                  rows={10}
                />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Words",      value: wordCount },
                  { label: "Est. Length", value: estDur   },
                  { label: "Characters", value: charCount.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#0f1020] border border-white/[0.06] rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-white">{value}</p>
                    <p className="text-[10px] text-zinc-700 uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Generate audio */}
              <button
                onClick={handleGenerateAudio}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
              >
                <Mic size={14} />
                Generate Audio with ElevenLabs
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════
              STEP 3 — Audio
          ══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl overflow-hidden">
              {audioLoading ? (
                /* Generating state */
                <div className="p-12 flex flex-col items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    <Mic size={24} className="text-violet-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-zinc-200">Generating audio…</p>
                    {/* TODO: Replace with real ElevenLabs streaming progress */}
                    <p className="text-xs text-zinc-600 mt-1">
                      ElevenLabs · DAVID AI VOICE NEW · {wordCount} words
                    </p>
                  </div>
                  {/* Animated waveform */}
                  <div className="flex gap-0.5 items-end h-8">
                    {WAVEFORM.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          background: "linear-gradient(to top, #8B5CF6, #06B6D4)",
                          animationDelay: `${i * 40}ms`,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Audio ready state */
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.3)" }}
                    >
                      <Check size={14} className="text-lime-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Audio Ready</p>
                      <p className="text-xs text-zinc-600">DAVID AI VOICE NEW · {estDur} · ElevenLabs</p>
                    </div>
                  </div>

                  {/* Real audio player */}
                  {audioUrl && (
                    <div
                      className="rounded-xl p-3.5"
                      style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}
                    >
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                        >
                          {isPlaying
                            ? <Pause size={12} className="text-white" />
                            : <Play  size={12} className="text-white ml-0.5" />
                          }
                        </button>
                        <div className="flex-1 flex items-end gap-px h-7">
                          {WAVEFORM.map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-full"
                              style={{
                                height: `${h}px`,
                                background: isPlaying && i < 9
                                  ? "linear-gradient(to top, #8B5CF6, #06B6D4)"
                                  : "rgba(255,255,255,0.07)",
                              }}
                            />
                          ))}
                        </div>
                        <a
                          href={audioUrl}
                          download="voiceover.mp3"
                          className="text-[11px] text-zinc-600 font-mono flex-shrink-0 hover:text-violet-400 transition-colors"
                          title="Download MP3"
                        >
                          ↓ mp3
                        </a>
                      </div>
                    </div>
                  )}

                  {audioError && (
                    <div
                      className="rounded-xl p-3.5 flex items-start gap-2"
                      style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
                    >
                      <AlertCircle size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-rose-400">{audioError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateVideo}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                  >
                    <Video size={14} />
                    Generate Video with HeyGen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              STEP 4 — Video
          ══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-4">
              {!videoReady ? (
                /* Rendering state */
                <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl p-6 space-y-6">
                  {/* Avatar info */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.12))",
                        border: "1px solid rgba(139,92,246,0.2)",
                      }}
                    >
                      🎭
                    </div>
                    <div className="flex-1">
                      {/* TODO: Replace with real avatar_id label from HeyGen account */}
                      <p className="text-sm font-bold text-white">Brand Avatar v2</p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        HeyGen Custom Avatar · 1080p · {estDur}
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}
                    >
                      Rendering
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs text-zinc-500">{statusMsg}</span>
                      <span className="text-sm font-black text-white">{videoProgress}%</span>
                    </div>
                    <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${videoProgress}%`,
                          background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
                        }}
                      />
                    </div>
                    {/* TODO: Replace with real estimated time from HeyGen API response */}
                    <p className="text-[10px] text-zinc-800 mt-2">Estimated time: ~1–2 minutes</p>
                  </div>

                  {/* Thin pulsing activity bar */}
                  <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full animate-pulse"
                        style={{
                          background: i < Math.floor(videoProgress / 5)
                            ? "linear-gradient(90deg, #8B5CF6, #06B6D4)"
                            : "rgba(255,255,255,0.04)",
                          animationDelay: `${i * 60}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Video ready state */
                <div className="space-y-4">
                  <div className="bg-[#0f1020] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {/* Video thumbnail */}
                    {/* TODO: Replace with real <video> or thumbnail from HeyGen video_url */}
                    <div
                      className="relative w-full flex items-center justify-center"
                      style={{
                        aspectRatio: "16/9",
                        background:
                          "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(6,182,212,0.1) 0%, transparent 60%), #0d0c18",
                      }}
                    >
                      <button
                        className="w-16 h-16 rounded-full flex items-center justify-center border transition-transform hover:scale-105"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          borderColor: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <Play size={20} className="text-white ml-1" />
                      </button>

                      <div className="absolute top-3 left-3">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded"
                          style={{ background: "rgba(132,204,22,0.2)", color: "#86efac" }}
                        >
                          ✓ Ready
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span
                          className="text-[10px] font-mono px-2 py-1 rounded"
                          style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.55)" }}
                        >
                          {estDur}
                        </span>
                      </div>
                    </div>

                    {/* File info */}
                    <div className="px-5 py-4 border-t border-white/[0.04] flex items-center gap-6">
                      {[
                        { label: "Resolution", value: "1080p" },
                        { label: "Duration",   value: estDur   },
                        { label: "File Size",  value: "24.7 MB" },
                        { label: "Format",     value: "MP4"    },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] text-zinc-700 uppercase tracking-wider">{label}</p>
                          <p className="text-xs font-bold text-zinc-300 mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download */}
                  {/* TODO: Replace onClick with real download — anchor to HeyGen video_url with download attribute */}
                  <button
                    className="w-full py-4 rounded-xl text-base font-black text-white flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                    onClick={() => {/* TODO: window.open(videoUrl, "_blank") or anchor download */}}
                  >
                    <Download size={18} />
                    Download Video
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 text-xs font-semibold text-zinc-700 hover:text-zinc-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={11} /> Start New
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
