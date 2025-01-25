import Image from "next/image";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import {
  ScrollText,
  Users,
  Book,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import SecretAuth from "@/components/SecretAuth";

export default async function Home() {

  // More robust session handling
  let isAuthenticated = false;

  try {
    const session = await getSession();
    isAuthenticated = Boolean(session?.user);
  } catch (error) {
    console.error("Session error:", error);
    isAuthenticated = false;
  }


  return (
    <div className="h-screen overflow-hidden bg-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-white/5 bg-black/10 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="h-16">
              <Image
                src="/images/logo/logo.png"
                width={140}
                height={140}
                alt="Cigar Mancave"
                priority
                className="h-full w-auto object-contain"
              />
            </Link>
            {/* <div className="flex gap-x-6">
              {session ? (
                <>
                  <Link href="/app/profile" className="text-sm font-semibold leading-6 text-[#EFA427] hover:text-[#E25931] transition-colors">
                    App
                  </Link>
                  <Link href="/api/auth/logout" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                    Log out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/api/auth/login" className="text-sm font-semibold leading-6 text-[#EFA427] hover:text-[#E25931] transition-colors">
                    Log in
                  </Link>
                  <Link href="/api/auth/login?screen_hint=signup" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
            </div> */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-24">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#EFA427] mb-6">
              More Than Just Another Cigar App
            </h1>

            {/* CTA Section */}
            <div className="my-16">
              <h3 className="text-xl text-white mb-1">
                Now in <span className="text-[#EFA427]">Beta.</span>
              </h3>
              <h1 className="text-xl text-white mb-4">
                Join us in building something special
              </h1>
              {/* <div className="flex justify-center gap-4">
                {!session ? (
                  <>
                    <Link
                      href="/api/auth/login?screen_hint=signup"
                      className="px-6 py-3 bg-[#E25931] text-white rounded-lg font-semibold
                      hover:bg-[#f06941] focus:outline-none focus:ring-2 focus:ring-[#EFA427] 
                      focus:ring-offset-2 focus:ring-offset-black flex items-center gap-2
                      transition-all duration-200"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/api/auth/login"
                      className="px-6 py-3 text-[#EFA427] hover:text-[#E25931] font-semibold
                      transition-colors flex items-center gap-2"
                    >
                      Log in
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/app/feeds"
                    className="px-6 py-3 bg-[#E25931] text-white rounded-lg font-semibold
                    hover:bg-[#f06941] focus:outline-none focus:ring-2 focus:ring-[#EFA427] 
                    focus:ring-offset-2 focus:ring-offset-black flex items-center gap-2
                    transition-all duration-200"
                  >
                    Go to App
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div> */}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Book,
                  title: "Your Digital Humidor",
                  description:
                    "Keep track of your collection, just like that leather journal - but digital. Track aging, take notes, and never lose a memory.",
                },
                {
                  icon: ScrollText,
                  title: "Share Your Experience",
                  description:
                    "Every cigar has a story. Share yours with detailed reviews, photos, and connect with fellow enthusiasts who get it.",
                },
                {
                  icon: Users,
                  title: "Find Your Community",
                  description:
                    "Connect with local aficionados, and maybe find your next smoking buddy. We're all family here.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] 
                  border border-white/10 hover:border-[#EFA427] transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-[#EFA427] mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-white/60 text-sm">
              <span>
                © {new Date().getFullYear()} Cigar Mancave. Built with{" "}
              </span>
              <SecretAuth isAuthenticated={isAuthenticated} />
              <span> by the community, for the community.</span>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-white/60 hover:text-[#E25931] transition-colors"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
