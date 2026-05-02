import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body?.user_id ?? body?.openid ?? "unknown";

    // Log the deletion request (replace with DB deletion if you store user data)
    console.log("[data-deletion] Request received for user:", userId, new Date().toISOString());

    // Respond with confirmation as required by TikTok / Meta
    return NextResponse.json({
      url: "https://social-analytics-beryl.vercel.app/data-deletion",
      confirmation_code: `del_${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Meta also sends a signed_request via GET for deauth callback
export async function GET() {
  return NextResponse.json({ status: "Data deletion endpoint active" });
}
