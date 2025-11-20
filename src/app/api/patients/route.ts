import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Patient from '@/models/patient';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth';

interface CreatePatientBody {
  patientName: string;
  age: number;
  disease: string;
  summary?: string;
  image?: string;
  phone?: string;
  appointmentDate?: string;
  referredDoctorName?: string;
}

export async function POST(request: NextRequest) {
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
    // Authenticate user
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only clinic doctors can create patients
    if (decoded.role !== 'clinicdoctor') {
      return NextResponse.json(
        { error: 'Only clinic doctors can book patient appointments' },
        { status: 403 }
      );
    }

    // Get clinic doctor details
    const clinicDoctor = await BaseUser.findById(decoded.id).lean() as any;
    if (!clinicDoctor || !clinicDoctor.fullname) {
      return NextResponse.json({ error: 'Clinic doctor not found' }, { status: 404 });
    }

    // Parse request body
    const body: CreatePatientBody = await request.json();
    const { patientName, age, disease, summary, image, phone, appointmentDate, referredDoctorName } = body;

    // Validate required fields
    if (!patientName || !age || !disease) {
      return NextResponse.json(
        { error: 'Patient name, age, and disease/problem are required' },
        { status: 400 }
      );
    }

    // Validate age is a number
    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 150) {
      return NextResponse.json(
        { error: 'Age must be a valid number between 0 and 150' },
        { status: 400 }
      );
    }

    // Create patient record
    const patient = await Patient.create({
      clinicDoctorId: decoded.id,
      clinicDoctorName: (clinicDoctor as any).fullname || 'Unknown',
      name: patientName.trim(),
      age: ageNumber,
      disease: disease.trim(),
      summary: summary?.trim() || '',
      phone: phone?.trim() || '',
      image: image || '',
      isVisited: false,
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Patient appointment booked successfully',
        patient: {
          id: patient._id.toString(),
          name: patient.name,
          age: patient.age,
          disease: patient.disease,
          clinicDoctorName: patient.clinicDoctorName,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create patient error:', err);
    
    // Handle validation errors
    if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'ValidationError') {
      const messages = Object.values((err as any).errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Server error during patient appointment booking' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch patients for a clinic doctor
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
    // Authenticate user
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only clinic doctors can view their patients
    if (decoded.role !== 'clinicdoctor') {
      return NextResponse.json(
        { error: 'Only clinic doctors can view patients' },
        { status: 403 }
      );
    }

    // Fetch patients for this clinic doctor
    const patients = await Patient.find({ clinicDoctorId: decoded.id })
      .sort({ createdAt: -1 })
      .lean() as any[];

    return NextResponse.json(
      {
        ok: true,
        patients: patients.map((p: any) => ({
          id: p._id?.toString() || '',
          name: p.name,
          age: p.age,
          disease: p.disease,
          summary: p.summary,
          image: p.image,
          isVisited: p.isVisited,
          clinicDoctorName: p.clinicDoctorName,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Get patients error:', err);
    return NextResponse.json(
      { error: 'Server error while fetching patients' },
      { status: 500 }
    );
  }
}


