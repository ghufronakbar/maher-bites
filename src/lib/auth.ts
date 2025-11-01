import { SignJWT, jwtVerify } from 'jose';
import {
  AUTH_COOKIE_NAME,
  EMAIL_APP,
  PASSWORD_APP,
  JWT_EXPIRATION,
  JWT_SECRET,
  assertAuthConfig,
} from '@/constants';

const encoder = new TextEncoder();

function getSecretKey() {
  assertAuthConfig();
  return encoder.encode(JWT_SECRET);
}

export async function createAuthToken(payload: Record<string, unknown>) {
  const key = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(key);
}

export async function verifyAuthToken(token: string) {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    console.warn('[auth] invalid token', error);
    return null;
  }
}

export function validateCredentials(email: string, password: string) {
  assertAuthConfig();
  return email === EMAIL_APP && password === PASSWORD_APP;
}

export { AUTH_COOKIE_NAME };
