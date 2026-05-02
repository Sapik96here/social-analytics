import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [{ data: goals, error: goalsErr }, { data: history, error: histErr }] =
    await Promise.all([
      supabase.from("social_platform_goals").select("*"),
      supabase.from("follower_history").select("platform,week_label,week_date,followers").order("week_date", { ascending: true }),
    ]);

  if (goalsErr || histErr) {
    return NextResponse.json({ error: goalsErr?.message ?? histErr?.message }, { status: 500 });
  }

  return NextResponse.json({ goals, history });
}
