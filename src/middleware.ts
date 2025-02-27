import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
export default createMiddleware(routing);
export const config = {
  matcher: ["/", "/(en|pt|fr|es|de)/:path*"],
};

// TODO: use middleware to authenticate quicker

/*
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // If using NextAuth
export async function middleware(request: NextRequest) {
  // Check paths that need protection
  if (request.nextUrl.pathname.startsWith("/api/stream-audio")) {
    const token = await getToken({ req: request });
    // If not authenticated, redirect to home page
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/api/stream-audio/:path*"],
};
*/