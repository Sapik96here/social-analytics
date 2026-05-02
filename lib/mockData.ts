// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — All data below is hardcoded for UI development.
// TODO: Replace with Meta Graph API calls when connecting real accounts.
// Relevant endpoints:
//   Instagram: GET /{ig-user-id}/media, /{ig-user-id}/insights
//   Facebook:  GET /{page-id}/posts, /{page-id}/insights
// ─────────────────────────────────────────────────────────────────────────────

export type Platform = "instagram" | "facebook";
export type DateRange = "7d" | "30d" | "90d";

export interface Post {
  id: string;
  accountId: string;
  title: string;
  thumbnailColor: string; // placeholder color for thumbnail
  publishedAt: string;
  views: number;
  reach: number;
  shares: number;
  saves: number;
  likes: number;
  comments: number;
}

export interface FollowerDataPoint {
  date: string;
  followers: number;
}

export interface Account {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  profileColor: string;
  totalFollowers: number;
  followerGrowth30d: number; // net change
  posts: Post[];
  followerTimeline: FollowerDataPoint[]; // 90-day daily data
}

// ─── Follower timeline helpers ────────────────────────────────────────────────

function generateTimeline(
  startFollowers: number,
  dailyGrowthBase: number,
  variance: number
): FollowerDataPoint[] {
  const points: FollowerDataPoint[] = [];
  let current = startFollowers;
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({
      date: d.toISOString().split("T")[0],
      followers: Math.round(current),
    });
    current += dailyGrowthBase + (Math.random() - 0.4) * variance;
  }
  return points;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

// TODO: Replace with Meta Graph API — GET /{ig-user-id}/media?fields=id,caption,media_type,timestamp,insights
const igOfficialPosts: Post[] = [
  {
    id: "ig-off-1",
    accountId: "ig-official",
    title: "Summer Collection Launch 🌊",
    thumbnailColor: "#1e3a5f",
    publishedAt: "2026-04-28",
    views: 84300,
    reach: 71200,
    shares: 2140,
    saves: 3870,
    likes: 6200,
    comments: 348,
  },
  {
    id: "ig-off-2",
    accountId: "ig-official",
    title: "Behind the Scenes: Studio Day",
    thumbnailColor: "#2d1b4e",
    publishedAt: "2026-04-21",
    views: 52100,
    reach: 44800,
    shares: 890,
    saves: 1540,
    likes: 4100,
    comments: 212,
  },
  {
    id: "ig-off-3",
    accountId: "ig-official",
    title: "Meet the Team — Spring Edition",
    thumbnailColor: "#1a3c2e",
    publishedAt: "2026-04-14",
    views: 38700,
    reach: 33500,
    shares: 670,
    saves: 980,
    likes: 3100,
    comments: 178,
  },
  {
    id: "ig-off-4",
    accountId: "ig-official",
    title: "Product Spotlight: Heritage Tote",
    thumbnailColor: "#3d2010",
    publishedAt: "2026-04-07",
    views: 61400,
    reach: 54900,
    shares: 1320,
    saves: 2890,
    likes: 5300,
    comments: 290,
  },
  {
    id: "ig-off-5",
    accountId: "ig-official",
    title: "Customer Story: @user_spotlight",
    thumbnailColor: "#0d2e3f",
    publishedAt: "2026-03-30",
    views: 29800,
    reach: 25600,
    shares: 440,
    saves: 720,
    likes: 2400,
    comments: 95,
  },
  {
    id: "ig-off-6",
    accountId: "ig-official",
    title: "Flash Sale — 48 Hours Only",
    thumbnailColor: "#3b1a1a",
    publishedAt: "2026-03-20",
    views: 73500,
    reach: 68000,
    shares: 3400,
    saves: 4100,
    likes: 7800,
    comments: 512,
  },
];

// TODO: Replace with Meta Graph API — GET /{ig-user-id}/media?fields=id,caption,media_type,timestamp,insights
const igThPosts: Post[] = [
  {
    id: "ig-th-1",
    accountId: "ig-th",
    title: "สินค้าใหม่ประจำฤดูร้อน ☀️",
    thumbnailColor: "#1e4a3f",
    publishedAt: "2026-04-27",
    views: 41200,
    reach: 36500,
    shares: 1120,
    saves: 2340,
    likes: 3800,
    comments: 215,
  },
  {
    id: "ig-th-2",
    accountId: "ig-th",
    title: "Collab กับ @th_influencer",
    thumbnailColor: "#2e1a4e",
    publishedAt: "2026-04-19",
    views: 67800,
    reach: 59200,
    shares: 2890,
    saves: 4120,
    likes: 6100,
    comments: 388,
  },
  {
    id: "ig-th-3",
    accountId: "ig-th",
    title: "แจกของรางวัล Giveaway 🎁",
    thumbnailColor: "#1a2e4a",
    publishedAt: "2026-04-12",
    views: 94500,
    reach: 82300,
    shares: 5600,
    saves: 3200,
    likes: 9800,
    comments: 1240,
  },
  {
    id: "ig-th-4",
    accountId: "ig-th",
    title: "วิธีแมทช์ลุค Summer Lookbook",
    thumbnailColor: "#3a1e10",
    publishedAt: "2026-04-05",
    views: 35600,
    reach: 30800,
    shares: 780,
    saves: 1890,
    likes: 3200,
    comments: 142,
  },
  {
    id: "ig-th-5",
    accountId: "ig-th",
    title: "เบื้องหลังงาน Pop-up Store",
    thumbnailColor: "#0f2e1a",
    publishedAt: "2026-03-28",
    views: 22400,
    reach: 19800,
    shares: 320,
    saves: 540,
    likes: 1900,
    comments: 78,
  },
  {
    id: "ig-th-6",
    accountId: "ig-th",
    title: "New Drop Alert 🔔 Limited Edition",
    thumbnailColor: "#3a2a10",
    publishedAt: "2026-03-18",
    views: 58300,
    reach: 51600,
    shares: 2200,
    saves: 3100,
    likes: 5400,
    comments: 302,
  },
];

// TODO: Replace with Meta Graph API — GET /{page-id}/posts?fields=id,message,created_time,attachments
//   and GET /{post-id}/insights?metric=post_impressions,post_reach,post_shares
const fbThPosts: Post[] = [
  {
    id: "fb-th-1",
    accountId: "fb-th",
    title: "Brand Name TH — ต้อนรับฤดูร้อน 🌺",
    thumbnailColor: "#1a3a5f",
    publishedAt: "2026-04-26",
    views: 28400,
    reach: 24100,
    shares: 1840,
    saves: 0,
    likes: 2100,
    comments: 189,
  },
  {
    id: "fb-th-2",
    accountId: "fb-th",
    title: "โปรโมชั่นพิเศษ — ซื้อ 2 แถม 1",
    thumbnailColor: "#3a1f0a",
    publishedAt: "2026-04-18",
    views: 54700,
    reach: 47900,
    shares: 4200,
    saves: 0,
    likes: 3800,
    comments: 422,
  },
  {
    id: "fb-th-3",
    accountId: "fb-th",
    title: "Live Stream: New Arrivals Unboxing",
    thumbnailColor: "#0e2a3a",
    publishedAt: "2026-04-11",
    views: 38200,
    reach: 33400,
    shares: 2100,
    saves: 0,
    likes: 2900,
    comments: 644,
  },
  {
    id: "fb-th-4",
    accountId: "fb-th",
    title: "รีวิวจากลูกค้า ⭐⭐⭐⭐⭐",
    thumbnailColor: "#1e3a1a",
    publishedAt: "2026-04-03",
    views: 19800,
    reach: 17200,
    shares: 980,
    saves: 0,
    likes: 1600,
    comments: 87,
  },
  {
    id: "fb-th-5",
    accountId: "fb-th",
    title: "Event Recap: Bangkok Pop-up",
    thumbnailColor: "#2e0e3a",
    publishedAt: "2026-03-25",
    views: 31500,
    reach: 27800,
    shares: 1560,
    saves: 0,
    likes: 2400,
    comments: 213,
  },
  {
    id: "fb-th-6",
    accountId: "fb-th",
    title: "คอลเลคชั่นใหม่ล่าสุด — Shop Now",
    thumbnailColor: "#3a2a0e",
    publishedAt: "2026-03-15",
    views: 43600,
    reach: 38100,
    shares: 3200,
    saves: 0,
    likes: 3100,
    comments: 278,
  },
];

// ─── Accounts ─────────────────────────────────────────────────────────────────

// TODO: Replace with Meta Graph API — GET /{ig-user-id}?fields=id,username,followers_count,media_count
// TODO: Replace with Meta Graph API — GET /{page-id}?fields=id,name,fan_count,followers_count
export const accounts: Account[] = [
  {
    id: "ig-official",
    name: "IG @brandname_official",
    handle: "@brandname_official",
    platform: "instagram",
    profileColor: "#E1306C",
    totalFollowers: 128400,
    followerGrowth30d: 3820,
    posts: igOfficialPosts,
    followerTimeline: generateTimeline(120000, 95, 300),
  },
  {
    id: "ig-th",
    name: "IG @brandname_th",
    handle: "@brandname_th",
    platform: "instagram",
    profileColor: "#833AB4",
    totalFollowers: 87600,
    followerGrowth30d: 2140,
    posts: igThPosts,
    followerTimeline: generateTimeline(81000, 72, 250),
  },
  {
    id: "fb-th",
    name: "Brand Name TH",
    handle: "Brand Name TH",
    platform: "facebook",
    profileColor: "#1877F2",
    totalFollowers: 214300,
    followerGrowth30d: 1890,
    posts: fbThPosts,
    followerTimeline: generateTimeline(205000, 100, 400),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function filterPostsByDateRange(posts: Post[], range: DateRange): Post[] {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return posts.filter((p) => new Date(p.publishedAt) >= cutoff);
}

export function filterTimelineByDateRange(
  timeline: FollowerDataPoint[],
  range: DateRange
): FollowerDataPoint[] {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return timeline.filter((p) => new Date(p.date) >= cutoff);
}

export function postScore(post: Post): number {
  return post.views + post.shares * 3 + post.saves * 2;
}

export function getBestPost(posts: Post[]): Post | null {
  if (!posts.length) return null;
  return [...posts].sort((a, b) => postScore(b) - postScore(a))[0];
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function getAccountTotals(posts: Post[]) {
  return posts.reduce(
    (acc, p) => ({
      views: acc.views + p.views,
      reach: acc.reach + p.reach,
      shares: acc.shares + p.shares,
      saves: acc.saves + p.saves,
      likes: acc.likes + p.likes,
      comments: acc.comments + p.comments,
    }),
    { views: 0, reach: 0, shares: 0, saves: 0, likes: 0, comments: 0 }
  );
}
