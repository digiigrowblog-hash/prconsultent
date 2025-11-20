import { NextRequest, NextResponse } from 'next/server';
import { Db } from '@/lib/db';
import Notification from '@/models/notification';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await Db();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
  }
  try {
    const session = await auth(request);
     if(!session?.id){
      return NextResponse.json({error:"unauthorized"},{status:401})
    }
    const notification =await Notification.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notification); 

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch notifications.' }, { status: 500 }); 
  }
}