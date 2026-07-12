import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua.toLowerCase().includes("curl")) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname === "/blogs" || pathname.startsWith("/blogs/") || pathname === "/dashboard" || pathname === "/health" || pathname === "/consulting") {
    return NextResponse.rewrite(new URL("/tui" + pathname, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blogs", "/blogs/:path+", "/dashboard", "/health", "/consulting"],
};
