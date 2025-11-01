import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAuthToken, validateCredentials, verifyAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

interface LoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

async function loginAction(formData: FormData) {
  'use server';

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const redirectTargetRaw = String(formData.get('redirectTo') ?? '').trim();
  const redirectTarget = redirectTargetRaw.startsWith('/dashboard') ? redirectTargetRaw : '';

  if (!validateCredentials(email, password)) {
  const fallback = redirectTarget ? `&redirect=${encodeURIComponent(redirectTarget)}` : '';
    redirect(`/login?error=invalid${fallback}`);
  }

  const token = await createAuthToken({ email });

  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  redirect(redirectTarget || '/dashboard');
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (existingToken) {
    const payload = await verifyAuthToken(existingToken);
    if (payload) {
      redirect('/dashboard');
    }
  }

  const errorParam = (await searchParams)?.error;
  const error =
    typeof errorParam === 'string' && errorParam === 'invalid'
      ? 'Email atau password salah.'
      : null;
  const redirectTarget = typeof (await searchParams)?.redirect === 'string' ? (await searchParams)?.redirect : '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg shadow-emerald-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Masuk Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Gunakan kredensial internal untuk mengelola konten Maher Bites.
          </p>
        </div>
        <form action={loginAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTarget} />
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Masuk
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          Kembali ke{' '}
          <Link href="/" className="font-semibold text-emerald-600 hover:text-emerald-700">
            beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
