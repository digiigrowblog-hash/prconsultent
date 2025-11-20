import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Patient from '@/models/patient';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {

    try {
        await Db();
    } catch (dbError) {
        console.error('Database connection error:', dbError);
        return NextResponse.json(
            { error: 'Database connection failed. Please try again later.' },
            { status: 500 }
        );
    }
    try {
        const session = await auth(request);
        if (!session?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const patients = await Patient.find({}).exec();
        return NextResponse.json(patients);

    } catch (err) {
        console.error('Get patients error:', err);
        return NextResponse.json(
            { error: 'Server error while fetching patients' },
            { status: 500 }
        );
    }
}