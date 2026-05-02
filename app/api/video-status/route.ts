import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey  = process.env.HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "HeyGen not configured" }, { status: 500 });

  const videoId = req.nextUrl.searchParams.get("video_id");
  if (!videoId) return NextResponse.json({ error: "Missing video_id" }, { status: 400 });

  const res = await fetch(
    `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
    { headers: { "X-Api-Key": apiKey } }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  // data.data.status: "pending" | "processing" | "completed" | "failed"
  // data.data.video_url: string (when completed)
  return NextResponse.json(data.data ?? data);
}
