import { NextRequest, NextResponse } from "next/server";

// Flow:
// 1. Receive audio binary + avatarId + avatarType from client
// 2. Upload audio to HeyGen asset endpoint → get public URL
// 3. POST /v2/video/generate with avatar + audio URL → get video_id
// 4. Return video_id for client to poll

export async function POST(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "HeyGen not configured" }, { status: 500 });

  const formData  = await req.formData();
  const audioFile = formData.get("audio") as File | null;
  const avatarId  = formData.get("avatarId") as string | null;
  const avatarType = formData.get("avatarType") as "avatar" | "talking_photo" | null;

  if (!audioFile || !avatarId || !avatarType) {
    return NextResponse.json({ error: "Missing audio, avatarId or avatarType" }, { status: 400 });
  }

  // Step 1 — upload audio to HeyGen asset storage
  const assetForm = new FormData();
  assetForm.append("content", audioFile, "voiceover.mp3");
  assetForm.append("type", "audio");

  const assetRes = await fetch("https://upload.heygen.com/v1/asset", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: assetForm,
  });

  if (!assetRes.ok) {
    const err = await assetRes.text();
    return NextResponse.json({ error: `Asset upload failed: ${err}` }, { status: assetRes.status });
  }

  const assetData = await assetRes.json();
  const audioUrl  = assetData?.data?.url;
  if (!audioUrl) return NextResponse.json({ error: "No URL returned from asset upload" }, { status: 500 });

  // Step 2 — generate video
  const character =
    avatarType === "talking_photo"
      ? { type: "talking_photo", talking_photo_id: avatarId }
      : { type: "avatar", avatar_id: avatarId, avatar_style: "normal" };

  const videoRes = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      video_inputs: [{ character, voice: { type: "audio", audio_url: audioUrl } }],
      dimension: { width: 1280, height: 720 },
    }),
  });

  if (!videoRes.ok) {
    const err = await videoRes.text();
    return NextResponse.json({ error: `Video generation failed: ${err}` }, { status: videoRes.status });
  }

  const videoData = await videoRes.json();
  const videoId   = videoData?.data?.video_id;
  if (!videoId) return NextResponse.json({ error: "No video_id returned from HeyGen" }, { status: 500 });

  return NextResponse.json({ videoId });
}
