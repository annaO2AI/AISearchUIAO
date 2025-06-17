// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const PUBLIC_PATHS = ["/auth/callback"]

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path))
//   const token = request.cookies.get("access_token")?.value

//   if (!isPublicPath && !token) {
//     const redirectTo = `${request.nextUrl.origin}/auth/callback`
//     const loginUrl = `https://ai-search-hr-api-dfbahehtdkaxh7c2.centralus-01.azurewebsites.net/api/auth/login?redirect_uri=${encodeURIComponent(
//       redirectTo
//     )}`
//     return NextResponse.redirect(loginUrl)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// }


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth/callback", "/api/auth/login"];

// Dynamically determine the frontend base URL based on environment
const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_BASE_URL = isProduction
  ? "https://ai-search-hr-web-exevd6bfgdfdcvdj.centralus-01.azurewebsites.net"
  : "http://localhost:8087"; // Use http for local dev if not using HTTPS

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const token = request.cookies.get("access_token")?.value;

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    const finalRedirect = "https://ai-search-hr-web-exevd6bfgdfdcvdj.centralus-01.azurewebsites.net/";
    const callbackUrl = `${FRONTEND_BASE_URL}/auth/callback?finalRedirect=${encodeURIComponent(finalRedirect)}`;
    const loginUrl = `https://ai-search-hr-api-dfbahehtdkaxh7c2.centralus-01.azurewebsites.net/api/auth/login?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};