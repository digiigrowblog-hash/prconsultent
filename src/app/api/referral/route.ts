import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Referral from "../../../models/refrrels"
import Patient from '@/models/patient';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth';
import NotificationModel from '../../../models/notification'; // added import

export async function POST(request: NextRequest) {
  try {
    await Db();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (decoded.role !== 'clinicdoctor') {
      return NextResponse.json({ error: 'Only clinic doctors can create referrals' }, { status: 403 });
    }

    const body = await request.json();
    const { patientId, professionalDoctorId } = body;

    if (!patientId || !professionalDoctorId) {
      return NextResponse.json({ error: 'Patient ID and professional doctor ID are required' }, { status: 400 });
    }

    // Verify patient exists and belongs to clinic doctor
    const patient = await Patient.findById(patientId);
    if (!patient || patient.clinicDoctorId.toString() !== decoded.id) {
      return NextResponse.json({ error: 'Invalid patient or access denied' }, { status: 404 });
    }

    // Verify professional doctor exists
    const profDoc = await BaseUser.findOne({ _id: professionalDoctorId, role: 'professionaldoctor' });
    if (!profDoc) {
      return NextResponse.json({ error: 'Professional doctor not found' }, { status: 404 });
    }

    // Create Referral
    const referral = await Referral.create({
      clinicDoctor: decoded.id,
      clinicDoctorName: (await BaseUser.findById(decoded.id))?.fullname || '',
      professionalDoctor: professionalDoctorId,
      patient: patientId,
      status: 'pending',
    });

    const patientDetails = {
      name: patient.name || patient.fullname || '',
      age: patient.age,
      disease: patient.disease || '',
      phone: patient.phone || '',
      // Add any other patient fields you want here
    };

    // Create notification for the professional doctor
    await NotificationModel.create({
      to: professionalDoctorId,
      type: 'referral',
      message: `You have a new patient referral from Dr. ${(await BaseUser.findById(decoded.id))?.fullname || ''}.`,
      referral: referral._id,
      read: false,
      patientInfo: patientDetails,
      createdAt: new Date(),
    });

    // After referral.status change and save
    const notification = await NotificationModel.findOne({ referral: referral._id, to: decoded.id });
    if (notification) {
      notification.read = true;  // Mark notification as read since doctor responded
      await notification.save();
    }


    return NextResponse.json({ ok: true, referral }, { status: 201 });

  } catch (err) {
    console.error('Referral create error:', err);
    return NextResponse.json({ error: 'Server error creating referral' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await Db();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (decoded.role !== 'professionaldoctor') {
      return NextResponse.json({ error: 'Only professional doctors can view their referrals' }, { status: 403 });
    }

    const referrals = await Referral.find({
      professionalDoctor: decoded.id,
      status: { $in: ['pending', 'passed', 'cancelled'] },
    })
      .populate('patient')
      .populate('clinicDoctor')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, referrals }, { status: 200 });
  } catch (err) {
    console.error('Get referrals error:', err);
    return NextResponse.json({ error: 'Server error fetching referrals' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await Db();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (decoded.role !== 'professionaldoctor') {
      return NextResponse.json({ error: 'Only professional doctors can update referrals' }, { status: 403 });
    }

    const { referralId, status, message } = await request.json();

    if (!referralId || !['passed', 'cancelled', 'confirmed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid referral ID or status' }, { status: 400 });
    }

    const referral = await Referral.findById(referralId);
    if (!referral || referral.professionalDoctor.toString() !== decoded.id) {
      return NextResponse.json({ error: 'Referral not found or access denied' }, { status: 404 });
    }

    referral.status = status;
    referral.respondedBy = decoded.id;
    referral.respondedAt = new Date();

    await referral.save();

    // Optionally: Update patient.isVisited if referral confirmed
    if (status === 'confirmed') {
      await Patient.findByIdAndUpdate(referral.patient, { isVisited: true });
    }

    // Create notification to clinic doctor here or via separate function if preferred

    return NextResponse.json({ ok: true, referral }, { status: 200 });
  } catch (err) {
    console.error('Update referral error:', err);
    return NextResponse.json({ error: 'Server error updating referral' }, { status: 500 });
  }
}
