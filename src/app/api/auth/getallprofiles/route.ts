import { NextRequest, NextResponse } from "next/server";
import BaseUser from "@/models/baseUser"; // Adjust import path if needed
import { auth } from "@/lib/auth"; // Your auth helper for JWT verification
import { Db } from "@/lib/db"; // Your database connection helper

export async function GET(request: NextRequest) {
    await Db(); // Ensure database connection
  // Authenticate the request
  const user = await auth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all users from the database
    const users = await BaseUser.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
