import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import BaseUser from '@/models/baseUser';
import { auth } from '@/lib/auth'; 

interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phone: string | null;
  specialization: string | null;
  experience: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface UserDoc {
  _id: any; 
  fullname: string;
  email: string;
  role: string;
  phone?: string | null;
  specialization?: string | null;
  experience?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateProfileBody {
  fullname?: string;
  phone?: string | null;
  specialization?: string | null;
  experience?: number | null;
}

export async function PATCH(request: NextRequest) {
  await Db();

  try {
    
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = decoded.id;

    // Parse request body JSON
    const body: UpdateProfileBody = await request.json();

    // Validate or sanitize inputs if needed here before updating

    // Prepare data to update - only allowed fields
    const updateData: Partial<UpdateProfileBody> = {};
    if (body.fullname) updateData.fullname = body.fullname.trim();
    if (typeof body.phone !== 'undefined') updateData.phone = body.phone ? body.phone.trim() : null;
    if (typeof body.specialization !== 'undefined') updateData.specialization = body.specialization ? body.specialization.trim() : null;
    if (typeof body.experience !== 'undefined') updateData.experience = body.experience;

    const updatedUser = await BaseUser.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    ).lean<UserDoc | null>();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare response user profile (exclude sensitive data)
    const profileData : ProfileData= {
      id: updatedUser._id.toString(),
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone || null,
      specialization: updatedUser.specialization || null,
      experience: updatedUser.experience ?? null,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({ ok: true, profile: profileData }, { status: 200 });
  } catch (err) {
    console.error('updateProfile error', err);
    return NextResponse.json({ error: 'Server error during profile update' }, { status: 500 });
  }
}
