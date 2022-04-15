import { serialize } from 'cookie';

import { CookieKey, cookieTtl } from '@/config/cookies';

export function buildCookie(
  key: CookieKey,
  value: string,
  isProd: boolean,
  maxAge: number,
  httpOnly = false,
) {
  return serialize(key, value, {
    httpOnly,
    secure: isProd,
    sameSite: isProd,
    path: '/',
    maxAge,
  });
}

export function buildUserIdCookie(userId: string, isProd: boolean): string {
  return buildCookie(
    CookieKey.UserId,
    userId,
    isProd,
    cookieTtl[CookieKey.UserId],
    true,
  );
}

export function buildScreenNumberCookie(
  screenNumber: number,
  isProd: boolean,
): string {
  return buildCookie(
    CookieKey.ScreenNumber,
    String(screenNumber),
    isProd,
    cookieTtl[CookieKey.ScreenNumber],
  );
}
