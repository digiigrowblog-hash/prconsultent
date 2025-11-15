import { NextRequest, NextResponse } from 'next/server';
const cookieName = process.env.COOKIE_NAME || 'prref_token';

const publicRoutes = ["/", "/signin", "/signup"];
const protectedRoutes = ["/doctorInfo", "/notification"];

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get(cookieName)?.value;

    // Public route logic
    if (publicRoutes.includes(path)) {
        if (token && (path === "/signin" || path === "/signup")) {
            // Authenticated user shouldn't see sign-in/sign-up again
            return NextResponse.redirect(new URL("/", request.url));
        }
        // All users can see "/"
        return NextResponse.next();
    }

    // Protected route logic
    if (protectedRoutes.includes(path)) {
        if (!token) {
            // Not authenticated, redirect to sign-in
            return NextResponse.redirect(new URL("/signin", request.url));
        }
        // Authenticated user, allow access
        return NextResponse.next();
    }

    // Default: redirect unauthenticated users trying to access unknown/protected routes
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
    matcher: [
        "/", "/signup", "/signin", "/doctorInfo", "/notification"
    ]
}
