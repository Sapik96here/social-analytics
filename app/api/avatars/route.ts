import { NextResponse } from "next/server";

const AVATAR_IDS = [
  "d1b89963395142818e1725be0f2d6af6",
  "65a6b89fca064a2490c4c92d1795aafa",
  "0249c2c8c03e4b4dbfa8734f35ecf377",
];

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "HeyGen not configured" }, { status: 500 });

  const res  = await fetch("https://api.heygen.com/v2/avatars?include_talking_photo=true", {
    headers: { "X-Api-Key": apiKey },
    next: { revalidate: 300 }, // cache for 5 min
  });

  const data = await res.json();
  const photos  = (data?.data?.talking_photos ?? []) as { talking_photo_id: string; talking_photo_name: string; preview_image_url: string }[];
  const avatars = (data?.data?.avatars ?? [])         as { avatar_id: string; avatar_name: string; preview_image_url: string }[];

  const result = AVATAR_IDS.map((id) => {
    const photo  = photos.find((p) => p.talking_photo_id === id);
    const avatar = avatars.find((a) => a.avatar_id === id);
    if (photo)  return { id, type: "talking_photo" as const, label: photo.talking_photo_name  || "Photo Avatar", thumbnail: photo.preview_image_url  };
    if (avatar) return { id, type: "avatar"        as const, label: avatar.avatar_name        || "Avatar",       thumbnail: avatar.preview_image_url };
    return { id, type: "avatar" as const, label: id.slice(0, 8), thumbnail: null };
  });

  return NextResponse.json(result);
}
