import { NextResponse } from "next/server";

const IG_ID     = process.env.META_IG_ID!;
const PAGE_TOKEN = process.env.META_PAGE_TOKEN!;
const BASE      = "https://graph.facebook.com/v21.0";

export async function GET() {
  if (!IG_ID || !PAGE_TOKEN) {
    return NextResponse.json({ error: "Meta not configured" }, { status: 500 });
  }

  const [profileRes, mediaRes] = await Promise.all([
    fetch(`${BASE}/${IG_ID}?fields=username,followers_count,media_count,name,profile_picture_url&access_token=${PAGE_TOKEN}`, { next: { revalidate: 300 } }),
    fetch(`${BASE}/${IG_ID}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,thumbnail_url,media_url&limit=12&access_token=${PAGE_TOKEN}`, { next: { revalidate: 300 } }),
  ]);

  if (!profileRes.ok || !mediaRes.ok) {
    const err = await (profileRes.ok ? mediaRes : profileRes).text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const profile = await profileRes.json();
  const media   = await mediaRes.json();

  return NextResponse.json({ profile, posts: media.data ?? [] });
}
