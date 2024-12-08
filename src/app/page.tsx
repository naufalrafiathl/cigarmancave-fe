import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { getSession } from "@auth0/nextjs-auth0";
import { ScrollText, Users, Book, Repeat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  headers();

  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Session error:", error);
  }

  return (
    <div className="bg-[#171717] min-h-screen">
      {/* Header/Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image
                src="/images/logo/logo.png"
                width={130}
                height={80}
                alt="Cigar Mancave"
                priority
                style={{ height: "auto" }}
                loading="eager"
                quality={90}
              />
            </Link>
          </div>
          <div className="flex gap-x-6">
            {session ? (
              <>
                <a href="/profile" className="text-sm font-semibold leading-6 text-[#EFA427] hover:text-[#FFB947] transition-colors">
                  App
                </a>
                <a href="/api/auth/logout" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                  Log out
                </a>
              </>
            ) : (
              <>
                <a href="/api/auth/login" className="text-sm font-semibold leading-6 text-[#EFA427] hover:text-[#FFB947] transition-colors">
                  Log in
                </a>
                <a href="/api/auth/login?screen_hint=signup" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                  Sign up
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#EFA427] to-[#8B4513] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#EFA427] sm:text-6xl">
              Finally, The Cigar App Done Right
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              More than just another cigar app. Experience the most comprehensive, beautifully crafted platform for the modern aficionado.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!session ? (
                <>
                  <a href="/api/auth/login?screen_hint=signup" 
                     className="rounded-md bg-[#EFA427] px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#FFB947] transition-colors">
                    Get started
                  </a>
                  <a href="/api/auth/login" 
                     className="text-sm font-semibold leading-6 text-[#EFA427] hover:text-[#FFB947] transition-colors">
                    Log in <span aria-hidden="true">→</span>
                  </a>
                </>
              ) : (
                <a href="/profile" 
                   className="rounded-md bg-[#404040] px-5 py-3 text-sm font-semibold text-[#EFA427] shadow-sm hover:bg-[#505050] transition-colors">
                  To app
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#EFA427]">
              Everything You Need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              All-in-one platform for cigar enthusiasts
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#EFA427]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#404040]">
                    <Book className="h-6 w-6 text-[#EFA427]" />
                  </div>
                  Digital Humidor
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  Keep track of your collection with detailed information about each cigar. Monitor humidity, temperature, and aging progress.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#EFA427]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#404040]">
                    <ScrollText className="h-6 w-6 text-[#EFA427]" />
                  </div>
                  Detailed Reviews
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  Share your experiences and read reviews from other enthusiasts. Track flavor profiles, burn quality, and overall impressions.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#EFA427]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#404040]">
                    <Users className="h-6 w-6 text-[#EFA427]" />
                  </div>
                  Community
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  Connect with fellow cigar lovers, share your collection, and participate in discussions about your favorite smokes.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#EFA427]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#404040]">
                    <Repeat className="h-6 w-6 text-[#EFA427]" />
                  </div>
                  Trading Platform
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  Find and trade cigars with other collectors in your area. Build your collection through our secure trading platform.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>


      {/* New Footer Section */}
      <footer className="bg-[#1a1a1a] border-t border-[#333333]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Image
                src="/images/logo/logo.png"
                width={100}
                height={60}
                alt="Cigar Mancave"
                style={{ height: "auto" }}
                quality={90}
              />
              <p className="text-gray-400 text-sm mt-4">
                The ultimate platform for cigar enthusiasts to connect, share, and trade.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#EFA427] font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/features" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[#EFA427] font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="/disclaimer" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[#EFA427] font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={16} className="text-[#EFA427]" />
                  <a href="mailto:support@cigarmancave.com" className="hover:text-[#EFA427] transition-colors">
                    support@cigarmancave.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={16} className="text-[#EFA427]" />
                  <a href="tel:+1234567890" className="hover:text-[#EFA427] transition-colors">
                    (123) 456-7890
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-[#EFA427]" />
                  <span>New York, NY 10001</span>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="https://facebook.com" className="text-gray-400 hover:text-[#EFA427] transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-[#EFA427] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-[#EFA427] transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#333333]">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Cigar Mancave. All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="/sitemap" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                  Sitemap
                </a>
                <span className="text-gray-400">|</span>
                <a href="/accessibility" className="text-gray-400 hover:text-[#EFA427] transition-colors text-sm">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}