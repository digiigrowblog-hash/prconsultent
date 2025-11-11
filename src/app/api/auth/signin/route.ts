import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Db } from '../../../lib/db';
import BaseUser from "../../../models/baseUser";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';
const TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Cookie setter using NextResponse.cookies API
function setTokenCookie(res: NextResponse, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: TOKEN_EXPIRES_SECONDS,
        sameSite: 'strict',
        secure: isProd,
    });
}

export async function POST(request: NextRequest) {
    await Db();

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'email and password required' },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Find user in base collection
        const user = await BaseUser.findOne({ email: normalizedEmail }).lean();
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Validate password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare and return response
        const res = NextResponse.json({
            ok: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                phone: user.phone || null,
                specialization: user.specialization || null
            }
        });

        setTokenCookie(res, token);
        return res;
    } catch (err) {
        console.error('signin error', err);
        return NextResponse.json(
            { error: 'Server error during signin' },
            { status: 500 }
        );
    }
}