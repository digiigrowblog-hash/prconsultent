import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Db } from '../../../lib/db';
import BaseUser from '../../../models/baseUser';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';

export async function POST(request: NextRequest) {
    if (!JWT_SECRET) {
        return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
    }

    await Db();

    try {
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            // Already logged out or no token present
            return NextResponse.json({ ok: true, message: 'Logged out' });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            // Invalid token, just clear cookie anyway
            const res = NextResponse.json({ ok: true, message: 'Logged out' });
            res.cookies.delete({
                name: COOKIE_NAME,
                path: '/',
            });

        }

        // Remove refreshToken from DB for logged out user
        await BaseUser.updateOne({ _id: decoded.id }, { $unset: { refreshToken: "" } });

        // Clear the cookie on client by setting it with Max-Age=0
        const res = NextResponse.json({ ok: true, message: 'Logged out successfully' });
        res.cookies.delete(
            {
                name: COOKIE_NAME,
                path: '/',
            }
        )

        return res;
    } catch (err) {
        console.error('logout error', err);
        return NextResponse.json({ error: 'Server error during logout' }, { status: 500 });
    }
}
