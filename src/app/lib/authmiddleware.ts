import { NextResponse, NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'prref_token';

export interface AuthUser {
    id: string;
    role: string;
    email: string;
}

export async function authMiddleware(request: NextRequest) {
    if (!JWT_SECRET) {
        return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
    };
    try {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ error: 'Authentication token missing' }, { status: 401 });
        }
        const decord = jwt.verify(token, JWT_SECRET) as AuthUser;
        if (!decord) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        } 
        return decord;

    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}