'use client';

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, UserCircle, Flame, Package2 } from "lucide-react";
import { usePathname } from 'next/navigation';
import { SmokeNowModal } from "../SmokeNowModal";
import ReviewModal from "@/app/app/profile/components/review/ReviewModal";

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
  if (href === '/app/feeds') {
    return pathname === '/app/feeds';
  }
  return pathname.startsWith(href);
};

export const MobileNav: React.FC<NavProps> = () => {
  const pathname = usePathname();
  const [smokeModalOpen, setSmokeModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedCigar, setSelectedCigar] = useState<{
    id: number;
    name: string;
    brand: string;
  } | null>(null);
  
  return (
    <>
      <div className="rounded-t-xl fixed bottom-0 left-0 right-0 bg-[#EFA427] md:hidden z-50">
        <nav className="flex justify-around items-center h-16">
          <Link
            href="/app/feeds"
            className={`flex flex-col items-center px-4 ${
              isLinkActive(pathname, '/app/feeds')
                ? 'text-[#222222] rounded-xl'
                : 'text-[#222222]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Feeds</span>
          </Link>
          <button
            onClick={() => setSmokeModalOpen(true)}
            className="flex flex-col items-center px-4 text-[#222222]"
          >
            <Flame className="w-5 h-5" />
            <span className="text-xs">Smoke Now</span>
          </button>
          <Link
            href="/app/profile/mobile"
            className={`flex flex-col items-center px-4 ${
              isLinkActive(pathname, '/app/profile')
                ? 'text-[#222222] rounded-xl'
                : 'text-[#222222]'
            }`}
          >
            <Package2 className="w-5 h-5" />
            <span className="text-xs">Humidor</span>
          </Link>
        </nav>
      </div>

      <SmokeNowModal
        isOpen={smokeModalOpen}
        onClose={() => setSmokeModalOpen(false)}
        onSelectCigar={(cigar) => {
          setSelectedCigar(cigar);
          setSmokeModalOpen(false);
          setReviewModalOpen(true);
        }}
      />

      {selectedCigar && (
        <ReviewModal
          humidorCigarId={1}
          isHumidorCigar={false}
          cigar={{
            id: selectedCigar.id,
            name: selectedCigar.name,
            brand: selectedCigar.brand,
          }}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedCigar(null);
          }}
          onSubmit={() => {}}
        />
      )}
    </>
  );
};