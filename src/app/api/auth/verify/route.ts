// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // <-- expects src/lib/auth.ts and baseUrl/path alias

export async function GET(request: Request) {
  try {
    const user = await auth(request); // auth returns decoded payload or null
    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    return NextResponse.json({ valid: true, user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
