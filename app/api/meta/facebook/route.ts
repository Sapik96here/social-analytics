import { NextResponse } from "next/server";

const PAGE_ID    = process.env.FACEBOOK_PAGE_ID!;
const PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;
const BASE       = "https://graph.facebook.com/v21.0";

async function tryFetch(url: string) {
  try {
    const res  = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    if (data.error) return { data: null, error: data.error.message as string };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

export async function GET() {
  if (!PAGE_ID || !PAGE_TOKEN) {
    return NextResponse.json({ error: "Facebook not configured" }, { status: 500 });
  }

  const since = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60; // 30 days ago
  const until = Math.floor(Date.now() / 1000);

  const [pageRes, feedRes, insightsRes] = await Promise.all([
    tryFetch(`${BASE}/${PAGE_ID}?fields=name,followers_count,fan_count,about&access_token=${PAGE_TOKEN}`),
    tryFetch(`${BASE}/${PAGE_ID}/feed?fields=message,created_time,full_picture,likes.summary(true),shares,comments.summary(true)&limit=10&access_token=${PAGE_TOKEN}`),
    tryFetch(`${BASE}/${PAGE_ID}/insights?metric=page_views_total,page_post_engagements,page_actions_post_reactions_total&period=day&since=${since}&until=${until}&access_token=${PAGE_TOKEN}`),
  ]);

  return NextResponse.json({
    page:          pageRes.data,
    pageError:     pageRes.error,
    posts:         feedRes.data?.data  ?? null,
    postsError:    feedRes.error,
    insights:      insightsRes.data?.data ?? null,
    insightsError: insightsRes.error,
  });
}
