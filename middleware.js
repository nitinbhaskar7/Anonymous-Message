import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(req) {
  // Get JWT token from the request using NextAuth's getToken
  
  const token = await getToken({ req : req });
  console.log(token)
  const url = req.nextUrl;

  if (token && (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') || 
      url.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// Middleware configuration: Define which routes the middleware should run on
export const config = { matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"] };


