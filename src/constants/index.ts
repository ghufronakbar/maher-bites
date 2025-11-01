export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const JWT_EXPIRATION = '7d';
export const EMAIL_APP = process.env.EMAIL_APP ?? '';
export const PASSWORD_APP = process.env.PASSWORD_APP ?? '';
export const AUTH_COOKIE_NAME = 'mb_dashboard_token';

export function assertAuthConfig() {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  if (!EMAIL_APP || !PASSWORD_APP) {
    throw new Error('EMAIL_APP or PASSWORD_APP is not set');
  }
}
