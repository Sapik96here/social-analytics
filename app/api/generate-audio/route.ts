import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, voiceSettings } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return NextResponse.json({ error: "ElevenLabs not configured" }, { status: 500 });
  }

  const {
    stability = 0.5,
    similarity_boost = 0.75,
    style = 0.0,
    speaker_boost = true,
    model = "eleven_multilingual_v2",
  } = voiceSettings ?? {};

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost,
          style,
          use_speaker_boost: speaker_boost,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const audioBuffer = await response.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="voiceover.mp3"',
    },
  });
}
