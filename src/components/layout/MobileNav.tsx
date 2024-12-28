'use client';

import Link from "next/link";
import { LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { usePathname } from 'next/navigation';

interface UserProfile {
  user: {
    profileImageUrl?: string;
    fullName?: string;
    email: string;
  };
}

interface NavProps {
  profile: UserProfile;
}

const isLinkActive = (pathname: string, href: string) => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname.startsWith(href);
};

export const MobileNav: React.FC<NavProps> = () => {
  const pathname = usePathname();
  
  return (
    <div className="rounded-t-xl fixed bottom-0 left-0 right-0 bg-[#EFA427] md:hidden z-50">
      <nav className="flex justify-around items-center h-16">
        <Link
          href="/feeds"
          className={`flex flex-col items-center px-4 ${
            isLinkActive(pathname, '/profile')
              ? 'text-[#222222] rounded-lg'
              : 'text-[#222222]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs">Feeds</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center px-4 ${
            isLinkActive(pathname, '/dashboard/profile')
              ? 'text-[#222222] rounded-lg'
              : 'text-[#222222]'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Link>
        <Link
          href="/api/auth/logout"
          className="flex flex-col items-center text-[#222222] px-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Logout</span>
        </Link>
      </nav>
    </div>
  );
};