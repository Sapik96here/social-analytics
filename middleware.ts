import { NextRequest, NextResponse } from "next/server";

const TIKTOK_TOKENS = [
  "gJdBgyAJYIBwY3VXBQPyuGOZGA0XIljo",
  "WA7n3BWR4sVO4NsfeuMRDeY2QyzaovTY",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  for (const token of TIKTOK_TOKENS) {
    const base = `/tiktok${token}.txt`;
    if (pathname === base || pathname === `${base}/`) {
      return new NextResponse(
        `tiktok-developers-site-verification=${token}`,
        { headers: { "Content-Type": "text/plain" } },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tiktok:path+.txt", "/tiktok:path+.txt/"],
};
