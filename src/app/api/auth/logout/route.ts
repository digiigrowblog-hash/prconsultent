import { NextResponse } from "next/server";
const COOKIE_NAME = process.env.COOKIE_NAME || "prref_token";
const refreshToken = process.env.JWT_SECRET!

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  // response.cookies.set(refreshToken, "", { maxAge: 0, path: "/" });
  return response;
}


