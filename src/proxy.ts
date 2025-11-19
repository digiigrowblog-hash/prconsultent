import { NextRequest, NextResponse } from 'next/server';
const cookieName = process.env.COOKIE_NAME || 'prref_token';

const publicRoutes = ["/", "/signin", "/signup"];
const protectedRoutes = ["/doctorInfo", "/notification"];
const adminRoutes = ["/dashboard"]; // Only for admin

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(cookieName)?.value;

  // Public route logic
  if (publicRoutes.includes(path)) {
    if (token && (path === "/signin" || path === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // All users can see "/"
    return NextResponse.next();
  }

  // Admin route logic
  if (adminRoutes.includes(path)) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Decode the JWT token to get user role (example, adapt for your token format)
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());
      if (payload.role === "admin") {
        return NextResponse.next();
      } else {
        // Not admin, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Token parse failed, redirect to signin
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // Protected route logic (doctor/professional)
  if (protectedRoutes.includes(path)) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // Default: redirect unauthenticated users trying to access unknown/protected routes
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/", "/signup", "/signin", "/doctorinfo", "/notification", "/dashboard"
  ]
};
