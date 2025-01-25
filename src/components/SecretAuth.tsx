// components/SecretAuth.tsx
import Link from 'next/link';

export default function SecretAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="relative group">
      {/* Added padding around the word to make it easier to hover */}
      <span className="mx-1 cursor-default hover:text-white/70 transition-colors px-2 py-4">
        passion
      </span>

      {/* Added a buffer zone with ::before */}
      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 
        bg-black/95 p-4 rounded-lg border border-white/10 z-50 min-w-[200px] mb-2
        after:content-[''] after:absolute after:h-4 after:w-full after:bottom-[-16px] after:left-0"
      >
        <div className="flex flex-col gap-4">
          {isAuthenticated ? (
            <Link
              href="/app/feeds"
              className="px-6 py-3 bg-[#E25931] text-white rounded-lg font-semibold
              hover:bg-[#f06941] focus:outline-none focus:ring-2 focus:ring-[#EFA427] 
              transition-all duration-200 text-center"
            >
              Go to App
            </Link>
          ) : (
            <>
              <Link
                href="/api/auth/login?screen_hint=signup"
                className="px-6 py-3 bg-[#E25931] text-white rounded-lg font-semibold
                hover:bg-[#f06941] focus:outline-none focus:ring-2 focus:ring-[#EFA427] 
                transition-all duration-200 text-center"
              >
                Sign Up
              </Link>
              <Link
                href="/api/auth/login"
                className="px-6 py-3 border border-[#EFA427] text-[#EFA427] rounded-lg font-semibold
                hover:bg-[#EFA427] hover:text-black transition-all duration-200 text-center"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}