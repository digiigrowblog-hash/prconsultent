import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "prref_token";

export interface DecodedUser {
  id: string;
  role: string;
  email: string;
}

// Function to get token from cookie and verify it
export function verifyAuthToken(req: NextRequest): DecodedUser {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) throw new Error("Authentication token missing");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    if (!decoded.id || !decoded.email || !decoded.role)
      throw new Error("Invalid token payload");
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
