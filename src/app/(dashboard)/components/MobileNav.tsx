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

// Helper function to check if link is active
const isLinkActive = (pathname: string, href: string) => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname.startsWith(href);
};

export const MobileNav: React.FC<NavProps> = () => {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#222222] md:hidden">
      <nav className="flex justify-around items-center h-16">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center px-4 ${
            isLinkActive(pathname, '/dashboard')
              ? 'text-gray-800 bg-gray-100 rounded-lg'
              : 'text-[#B9B9B9]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center px-4 ${
            isLinkActive(pathname, '/dashboard/profile')
              ? 'text-gray-800 bg-gray-100 rounded-lg'
              : 'text-[#B9B9B9]'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Link>
        <Link
          href="/api/auth/logout"
          className="flex flex-col items-center text-[#B9B9B9] px-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Logout</span>
        </Link>
      </nav>
    </div>
  );
};