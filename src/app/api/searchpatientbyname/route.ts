import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Patient from '@/models/patient';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth';


export async function GET(request: NextRequest) {
    const params = new URL(request.url).searchParams;
    const newQuery = params.get('name');

    if (!newQuery) {
        return NextResponse.json({ error: 'No name provided' },
            { status: 400 });
    }

    try {
        await Db();
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the database' },
            { status: 500 });
    }

    try {
        const patients = await Patient.find({ name: { $regex: newQuery, $options: 'i' } })
        .select("name age disease clinicDoctorName phone isVisited summary");
        return NextResponse.json({ patients } , {status:200});

    } catch (error) {
        return NextResponse.json({ error: 'Failed to search patients' },
            { status: 500 });
    }
}
