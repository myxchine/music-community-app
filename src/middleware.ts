import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
const handleI18nRouting = createMiddleware(routing);

export async function middleware(req: any) {
  const isSignInPage = routing.locales
    .flatMap((locale) => `/${locale}/signin`)
    .includes(req.nextUrl.pathname);

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("No auth secret");
  }
  const token = await getToken({
    req,
    secret,
  });

  const isAuthenticated = !!token;

  if (isSignInPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/en/account", req.url));
  }
  if (isSignInPage && !isAuthenticated) {
    return handleI18nRouting(req);
  }
  if (!isSignInPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/en/signin", req.url));
  }
}

export const config = {
  matcher: ["/", "/(en|pt|fr|es|de)/:path*", "/api/stream-audio"],
};
