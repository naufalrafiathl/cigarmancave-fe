"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

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
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
};

export const Sidebar: React.FC<NavProps> = ({ profile }) => {
  const pathname = usePathname();

  return (
    <div className="hidden md:block m-4 rounded-3xl fixed inset-y-0 left-0 w-64 bg-[#222222]">
      <div className="flex flex-col h-full">
        <div className="p-8">
          <Link href="/" className="text-xl font-bold text-gray-800">
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

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/profile"
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isLinkActive(pathname, "/dashboard")
                ? "bg-gray-100 text-gray-800"
                : "text-[#B9B9B9] hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <UserCircle className="w-5 h-5 mr-3" />
            Profile
          </Link>
          <Link
            href="/profile/test"
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isLinkActive(pathname, "/dashboard/profile")
                ? "bg-gray-100 text-gray-800"
                : "text-[#B9B9B9] hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Test
          </Link>
        </nav>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={profile.user.profileImageUrl || "/placeholder-avatar.png"}
                width={50}
                height={50}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-3 text-sm font-medium text-[#B9B9B9]">
                {profile.user.fullName || profile.user.email}
              </span>
            </div>
            <Link
              href="/api/auth/logout"
              className="p-2 text-[#B9B9B9] rounded-lg hover:bg-gray-100 hover:text-gray-800"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
