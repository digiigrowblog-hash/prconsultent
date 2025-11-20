import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Referral from "../../../models/refrrels"
import Patient from '@/models/patient';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth';
import NotificationModel from '@/models/notification';

export async function GET(request: NextRequest) {
  try {
    await Db();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const session = await auth(request);
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const referrals = await Referral.find({})
      .populate({ path: 'clinicDoctor', select: 'fullname' })           // populate clinic doctor name only
      .populate({ path: 'professionalDoctor', select: 'fullname' })     // populate professional doctor name only
      .populate({ path: 'patient', select: 'name' })                // populate patient name only
      .select('status')                                              // include status field from referral
      .exec();

    // Map to return formatted response with field names as requested
    const result = referrals.map(ref => ({
      clinicDoctor: ref.clinicDoctor?.fullname || null,
      professionalDoctor: ref.professionalDoctor?.fullname || null,
      patient: ref.patient?.name || null,
      status: ref.status,
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals.' }, { status: 500 });
  }
}
