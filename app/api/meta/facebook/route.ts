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

  // Run all three requests in parallel; each may fail independently
  const [pageRes, insightsRes, postsRes] = await Promise.all([
    tryFetch(`${BASE}/${PAGE_ID}?fields=name,followers_count,fan_count,about&access_token=${PAGE_TOKEN}`),
    tryFetch(`${BASE}/${PAGE_ID}/insights?metric=page_impressions,page_impressions_unique&period=day&date_preset=last_30d&access_token=${PAGE_TOKEN}`),
    tryFetch(`${BASE}/${PAGE_ID}/posts?fields=id,message,created_time,full_picture,likes.summary(true),comments.summary(true),shares&limit=10&access_token=${PAGE_TOKEN}`),
  ]);

  return NextResponse.json({
    page:     pageRes.data,
    pageError: pageRes.error,
    insights: insightsRes.data?.data ?? null,
    insightsError: insightsRes.error,
    posts:    postsRes.data?.data ?? null,
    postsError: postsRes.error,
  });
}
