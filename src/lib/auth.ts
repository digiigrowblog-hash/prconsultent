import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET!;

// Type guard to check if req is NextRequest
function isNextRequest(req: Request | NextRequest): req is NextRequest {
  return typeof (req as NextRequest).cookies?.get === "function";
}

// Get cookie value from NextRequest or standard Request
function getCookieFromRequest(req: Request | NextRequest, name: string): string | undefined {
  if (isNextRequest(req)) {
    return req.cookies.get(name)?.value;
  }

  const cookieHeader = (req as Request).headers.get("cookie") ?? "";
  if (!cookieHeader) return undefined;

  const parts = cookieHeader.split("; ");
  for (const part of parts) {
    const [k, ...v] = part.split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

// Auth function to verify JWT and return decoded payload or null
export async function auth(req: Request | NextRequest) {
  const token = getCookieFromRequest(req, COOKIE_NAME!);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      email: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
