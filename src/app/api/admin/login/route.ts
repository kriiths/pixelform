import { NextResponse } from 'next/server';
import { setAdminCookie, validatePassword, getAdminConfig } from '@/app/admin/auth';
import { texts } from '@/app/content/texts';

export async function POST(request: Request) {
  const { ready } = getAdminConfig();
  if (!ready) {
    return NextResponse.json(
      { success: false, message: texts.admin.missingPassword },
      { status: 500 },
    );
  }

  const { password } = (await request.json()) as { password?: string };

  if (!password) {
    return NextResponse.json(
      { success: false, message: texts.admin.auth.error },
      { status: 400 },
    );
  }

  const isValid = validatePassword(password);

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: texts.admin.auth.error },
      { status: 401 },
    );
  }

  setAdminCookie();

  return NextResponse.json({
    success: true,
    message: texts.admin.auth.success,
  });
}
