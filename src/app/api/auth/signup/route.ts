import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Db } from '@/lib/db';
import BaseUser from '@/models/baseUser';
import ClinicDoctor from '@/models/clinicDoctor';
import ProfessionalDoctor from '@/models/ProfessionalDoctor';
import Admin from '@/models/admin';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';
const TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

function setTokenCookie(res: NextResponse, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    maxAge: TOKEN_EXPIRES_SECONDS,
    sameSite: 'strict',
    secure: isProd,
  });
}

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT_SECRET not configured' }, { status: 500 });
  }

  await Db();

  try {
    const body = await request.json();
    console.log('Signup body:', body);
    const { fullname, email, password, role, phone, specialization, experience } = body;

    // Validate required fields
    if (!fullname || !email || !password || !role) {
      return NextResponse.json(
        { error: 'fullname, email, password and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'clinicdoctor', 'professionaldoctor'].includes(role)) {
      return NextResponse.json(
        { error: "role must be one of 'admin' | 'clinicdoctor' | 'professionaldoctor'" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check existing user
    const existing = await BaseUser.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let userDoc;

    if (role === 'clinicdoctor') {
      userDoc = await ClinicDoctor.create({
        fullname: fullname.trim(),
        email: normalizedEmail,
        password: passwordHash,
        phone: String(phone).trim(),
        specialization: String(specialization).trim(),
        experience: experience ? Number(experience) : 0,

      });
    } else if (role === 'professionaldoctor') {
      userDoc = await ProfessionalDoctor.create({
        fullname: fullname.trim(),
        email: normalizedEmail,
        password: passwordHash,
        phone: String(phone).trim(),
        specialization: String(specialization).trim(),
        experience: experience ? Number(experience) : 0,
      });
    } else if (role === 'admin') {
      userDoc = await Admin.create({
        fullname: fullname.trim(),
        email: normalizedEmail,
        password: passwordHash,
      });
    }

    const token = jwt.sign(
      {
        id: userDoc._id.toString(),
        role,
        email: normalizedEmail,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const responsePayload = {
      ok: true,
      profile: {
        id: userDoc._id.toString(),
        fullname: userDoc.fullname,
        email: userDoc.email,
        role: role,
        phone: (userDoc as any).phone || null,
        specialization: (userDoc as any).specialization || null,
        experience: (userDoc as any).experience || null,
      },
    };

    const res = NextResponse.json(responsePayload, { status: 201 });
    setTokenCookie(res, token);

    return res;
  } catch (err: unknown) {
    console.error('signup error', err);

    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as any).name === 'ValidationError' &&
      'errors' in err
    ) {
      const messages = Object.values((err as any).errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    return NextResponse.json({ error: 'Server error during signup' }, { status: 500 });
  }
}
