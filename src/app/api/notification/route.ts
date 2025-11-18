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
    const decoded = await auth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const notifications = await Notification.find({ to: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, notifications }, { status: 200 });
  } catch (err) {
    console.error('Get notifications error:', err);
    return NextResponse.json({ error: 'Server error fetching notifications' }, { status: 500 });
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

    const { notificationId } = await request.json();
    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    const notification = await Notification.findOne({ _id: notificationId, to: decoded.id });
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
    }

    notification.read = true;
    await notification.save();

    return NextResponse.json({ ok: true, notification }, { status: 200 });
  } catch (err) {
    console.error('Update notification error:', err);
    return NextResponse.json({ error: 'Server error updating notification' }, { status: 500 });
  }
};
