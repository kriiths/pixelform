import { createHash } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_auth';

function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function getAdminConfig() {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || '';

  if (!adminPassword) {
    return { ready: false as const, expectedHash: null };
  }

  return { ready: true as const, expectedHash: hashValue(adminPassword) };
}

export function isAdminAuthorized() {
  const config = getAdminConfig();

  if (!config.ready) {
    return { authorized: false, ready: false };
  }

  const cookieValue = cookies().get(COOKIE_NAME)?.value || '';
  return { authorized: cookieValue === config.expectedHash, ready: true };
}

export function setAdminCookie() {
  const config = getAdminConfig();
  if (!config.ready) return;

  cookies().set(COOKIE_NAME, config.expectedHash, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/admin',
    maxAge: 60 * 60 * 2, // 2 hours
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export function validatePassword(input: string) {
  const config = getAdminConfig();
  if (!config.ready) return false;

  return hashValue(input.trim()) === config.expectedHash;
}
