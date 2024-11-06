// src/app/page.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Force dynamic rendering
  headers();
  
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error('Session error:', error);
  }

  return (
    <div className="bg-white">
      {/* Header/Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold">Mancave</span>
            </Link>
          </div>
          <div className="flex gap-x-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Dashboard
                </Link>
                <a
                  href="/api/auth/logout"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/api/auth/login"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log in
                </a>
                <a
                  href="/api/auth/login?screen_hint=signup"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Personal Cigar Journey Starts Here
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Track your collection, share your experiences, and connect with fellow cigar enthusiasts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!session ? (
                <>
                  <a
                    href="/api/auth/login?screen_hint=signup"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </a>
                  <a
                    href="/api/auth/login"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Log in <span aria-hidden="true">→</span>
                  </a>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything You Need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All-in-one platform for cigar enthusiasts
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Digital Humidor
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Keep track of your collection with detailed information about each cigar.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Detailed Reviews
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Share your experiences and read reviews from other enthusiasts.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Community
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Connect with fellow cigar lovers and share your passion.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Trading Platform
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Find and trade cigars with other collectors in your area.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}