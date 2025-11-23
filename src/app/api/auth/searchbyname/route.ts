import { NextResponse ,NextRequest } from 'next/server';
import { Db } from '@/lib/db';
import BaseUser from '@/models/baseUser';

export async function GET(request: NextRequest) {
  
  const params = new URL(request.url).searchParams; // new URl 
  const nameQuery = params.get('name');

  if (!nameQuery) {
    return NextResponse.json({ error: 'Name query parameter is required' }, { status: 400 });
  }

  await Db();

  try {
    // Search users by fullname (or any other field)
    const users = await BaseUser.find({
      fullname: { $regex: nameQuery, $options: 'i' }, // case-insensitive search
    }).select('fullname specialization email phone experience role'); // select fields you want to return

    return NextResponse.json({ users },{status: 200 });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
