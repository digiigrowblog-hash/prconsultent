// app/api/auth/signup/route.js
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Db } from '../../../lib/db';
import BaseUser from '../../../models/baseUser';
import ClinicDoctor from '../../../models/clinicDoctor';
import ProfessionalDoctor from '../../../models/ProfessionalDoctor';
import Admin from '../../../models/admin';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';
const TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

function setTokenCookie(res:NextResponse, token:string) {
    // NextResponse doesn't expose setHeader in the same way; we return a NextResponse and attach cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_EXPIRES_SECONDS}; SameSite=Strict${isProd ? '; Secure' : ''}`;
    res.headers.append('Set-Cookie', cookie);
}

export async function POST(reqest: NextRequest) {
    await Db();

    try {
        const body = await reqest.json();
        const { fullname, email, password, role, username, phone, specialization } = body;

        if (!fullname || !email || !password || !role) {
            return NextResponse.json({
                error: 'fullname, email, password and role are required'
            },
                { status: 400 });
        }

        if (!['admin', 'clinic', 'professional'].includes(role)) {
            return NextResponse.json({ error: "role must be one of 'admin' | 'clinic' | 'professional'" }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // prevent duplicate across discriminators by checking BaseUser
        const existing = await BaseUser.findOne({ email: normalizedEmail });
        if (existing) return NextResponse.json({
            error: 'Email already registered' }, 
            { 
                status: 409 
            });

        const passwordHash = await bcrypt.hash(password, 10);

        let userDoc;
        if (role === 'clinic') {
            userDoc = await ClinicDoctor.create({
                fullname: fullname.trim(),
                username: username ? String(username).trim() : undefined,
                email: normalizedEmail,
                password:passwordHash,
                phone: phone ? String(phone).trim() : undefined,
                specialization: specialization ? String(specialization).trim() : undefined,
            });
        } else if (role === 'professional') {
            userDoc = await ProfessionalDoctor.create({
                fullname: fullname.trim(),
                email: normalizedEmail,
                passwordHash,
                phone: phone ? String(phone).trim() : undefined,
                specialization: specialization ? String(specialization).trim() : undefined,
            });
        } else {
            userDoc = await Admin.create({
                fullname: fullname.trim(),
                email: normalizedEmail,
                passwordHash,
            });
        }

        const token = jwt.sign({
            id: userDoc._id.toString(),
            role: role,
            email: normalizedEmail
        },
            JWT_SECRET!, { expiresIn: '7d' });

        const res = NextResponse.json({
            ok: true,
            user: {
                id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
                role: userDoc.role || role,
                phone: userDoc.phone || null,
                specialization: userDoc.specialization || null
            }
        }, { status: 201 });

        // set cookie header
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
