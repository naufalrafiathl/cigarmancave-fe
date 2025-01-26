// src/app/(dashboard)/components/SearchHeader.tsx
import { Search, UserCircle } from "lucide-react";
import { InfoDropdown } from "@/components/InfoDropdown";
import Image from "next/image";
import Link from "next/link";

interface SearchHeaderProps {
  profile: {
    data: {
      profileImageUrl?: string;
      fullName?: string;
      email: string;
    };
  };
}

export function SearchHeader({ profile }: SearchHeaderProps) {
  return (
    <div className="bg-[#222222] rounded-full w-full p-3 md:p-5 mb-3 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-1/2 xl:w-1/4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-[#B9B9B9]" />
            <input
              className="bg-[#3C3D3E] rounded-full p-2 pl-10 w-full focus:outline-none text-[#B9B9B9]"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InfoDropdown />
          <Link
            href="/app/profile?tab=humidor"
            className="md:hidden flex items-center p-1 rounded-full 
              hover:bg-[#2A2A2A] active:bg-[#3C3D3E] 
              transition-all duration-200 transform hover:scale-105 
              border border-transparent hover:border-[#EFA427]/20"
          >
            {profile?.data?.profileImageUrl ? (
              <div className="relative">
                <Image
                  src={
                    profile?.data?.profileImageUrl || "/placeholder-avatar.png"
                  }
                  width={32}
                  height={32}
                  alt="Profile"
                  className="rounded-full"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-[#EFA427]/10 ring-offset-2 ring-offset-[#222222]" />
              </div>
            ) : (
                <UserCircle className="w-8 h-8 sm:w-8 sm:h-8 text-neutral-400" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
