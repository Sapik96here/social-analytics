import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".docx")) {
    return NextResponse.json({ error: "Only .docx files are supported" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();

  if (!text) {
    return NextResponse.json({ error: "No text found in document" }, { status: 422 });
  }

  return NextResponse.json({ text });
}
