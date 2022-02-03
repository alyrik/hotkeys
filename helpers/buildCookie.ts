import { serialize } from 'cookie';
import { CookieKey } from '../models/CookieKey';

const maxCookieAge = 60 * 60 * 24 * 30 * 12 * 5;

export function buildCookie(
  key: CookieKey,
  value: string,
  isProd: boolean,
  maxAge: number,
) {
  return serialize(key, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd,
    path: '/',
    maxAge,
  });
}

export function buildUserIdCookie(userId: string, isProd: boolean): string {
  return buildCookie(CookieKey.UserId, userId, isProd, maxCookieAge);
}
