import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/app/admin/auth';

export async function POST() {
  clearAdminCookie();
  return NextResponse.json({ success: true });
}
