import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";

const PUBLIC_INSTRUCTOR_ROUTES = ["/instructor/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/instructor")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("session")?.value;
  const session = await verifyJwt(cookie);
  const isPublicRoute = PUBLIC_INSTRUCTOR_ROUTES.includes(pathname);

  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/instructor/login", request.url));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/instructor/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/instructor/:path*",
};
