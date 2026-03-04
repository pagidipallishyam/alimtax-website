import { NextResponse } from "next/server";

const DEFAULT_LANG = "en";
const SUPPORTED = ["en", "ru"];

export function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ✅ Ignore Next internals + API + common files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // ✅ IMPORTANT: Ignore public assets (your logo is here)
  // This prevents /brand/... from becoming /en/brand/...
  if (
    pathname.startsWith("/brand") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (SUPPORTED.includes(first)) return NextResponse.next();

  url.pathname = `/${DEFAULT_LANG}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};