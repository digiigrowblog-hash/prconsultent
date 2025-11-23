// // middleware.ts (place at project root)
// import { NextRequest, NextResponse } from "next/server";

// const cookieName = process.env.COOKIE_NAME || "prref_token";

// const publicRoutes = ["/", "/signin", "/signup"];
// const protectedRoutes = ["/doctorinfo", "/notification"];
// const adminRoutes = ["/dashboard"];

// function safeBase64Decode(input: string) {
//   try {
//     // If Buffer exists (Node), use it
//     if (typeof Buffer !== "undefined") {
//       return Buffer.from(input, "base64").toString("utf-8");
//     }
    

//     // Edge / browser: atob exists in most environments
//     if (typeof atob === "function") {
//       // atob returns a binary string; convert percent-encoded string to utf-8
//       const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/"));
//       // decodeURIComponent(escape(...)) is a common safe way to convert to utf-8
//       return decodeURIComponent(
//         Array.prototype.map
//           .call(binary, (c: string) => {
//             return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//           })
//           .join("")
//       );
//     }

//     // If nothing available, return empty
//     return "";
//   } catch (err) {
//     return "";
//   }
// }

// export default function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const token = request.cookies.get(cookieName)?.value;

//   // Public routes
//   if (publicRoutes.includes(path)) {
//     if (token && (path === "/signin" || path === "/signup")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }

//   // Admin routes
//   if (adminRoutes.includes(path)) {
//     if (!token) return NextResponse.redirect(new URL("/signin", request.url));
//     try {
//       const base64Payload = token.split(".")[1];
//       const decoded = safeBase64Decode(base64Payload);
//       const payload = decoded ? JSON.parse(decoded) : null;
//       if (payload && payload.role === "admin") return NextResponse.next();
//       return NextResponse.redirect(new URL("/", request.url));
//     } catch {
//       return NextResponse.redirect(new URL("/signin", request.url));
//     }
//   }

//   // Protected routes
//   if (protectedRoutes.includes(path)) {
//     if (!token) return NextResponse.redirect(new URL("/signin", request.url));
//     return NextResponse.next();
//   }

//   // Default: allow
//   return NextResponse.next();
// }

// // Only match the routes we care about; keep patterns simple
// export const config = {
//   matcher: ["/", "/signin", "/signup", "/doctorinfo", "/notification", "/dashboard"],
// };
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME || "prref_token";

const PUBLIC = ["/", "/signin", "/signup"];
const PROTECTED = ["/doctorinfo", "/notification"];
const ADMIN = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Public routes
  if (PUBLIC.includes(path)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token && (path === "/signin" || path === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Require token for protected/admin
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Forward cookie to server-side verify endpoint
  try {
    const verifyUrl = new URL("/api/auth/verify", request.url).toString();
    const res = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        cookie: `${COOKIE_NAME}=${token}`,
      },
    });

    if (res.status !== 200) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const data = await res.json();
    const user = data?.user;

    // Admin-only guard
    if (ADMIN.some((r) => path.startsWith(r)) && user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/doctorinfo/:path*",
    "/notification/:path*",
    "/dashboard/:path*",
  ],
};
