import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Db } from '../../../../lib/db';
import BaseUser from '../../../../models/baseUser';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';

interface UserDoc {
  _id: any; // Mongoose ObjectId
  fullname: string;
  email: string;
  role: string;
  phone?: string | null;
  specialization?: string | null;
  experience?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phone: string | null;
  specialization: string | null;
  experience: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
  }

  await Db();

  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication token missing' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Fetch user profile from database by ID with explicit typing
    const user = await BaseUser.findById(decoded.id).lean<UserDoc | null>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare profile data to return (exclude sensitive info like password, tokens)
    const profileData: ProfileData = {
      id: user._id.toString(),
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phone: user.phone || null,
      specialization: user.specialization || null,
      experience: user.experience ?? null,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ ok: true, profile: profileData }, { status: 200 });
  } catch (err) {
    console.error('getprofile error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
