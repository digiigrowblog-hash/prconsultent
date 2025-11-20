import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Referral from "../../../models/refrrels"
import Patient from '@/models/patient';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth';
import NotificationModel from '../../../models/notification'; 

export async function GET(request: NextRequest) {
    const params = new URL(request.url).searchParams;
    const newQuery = params.get('name');

    if (!newQuery) {
        return NextResponse.json({ error: 'Name is required' },{ status: 400 });
    }

    try {
        await Db();
    } catch (error) {
        NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
        const referrals = await Referral.find({ clinicDoctorName: { $regex: newQuery, $options: 'i' } });
        return NextResponse.json(referrals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
      
    }
}