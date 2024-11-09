// src/app/profile/page.tsx
import { getUserProfile } from "@/lib/api";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UserCircle,
  Search,
  Moon,
  Bell,
  Info,
  MapPin,
  Award,
  Users,
  Box,
  Star,
  Crown,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Define tab types
const TABS = {
  humidor: "humidor",
  reviews: "reviews",
  achievements: "achievements",
  subscription: "subscription",
} as const;

type TabType = (typeof TABS)[keyof typeof TABS];

function isValidTab(tab: string | undefined): tab is TabType {
  return tab !== undefined && Object.values(TABS).includes(tab as TabType);
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  const profile = await getUserProfile();

  // Validate and set current tab with type safety
  const currentTab: TabType = isValidTab(searchParams.tab)
    ? searchParams.tab
    : TABS.humidor;

  const tabContent: Record<TabType, JSX.Element> = {
    [TABS.humidor]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">My Humidor</h2>
        <p>Your humidor is empty. Add some cigars to get started!</p>
      </div>
    ),
    [TABS.reviews]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">My Reviews</h2>
        <p>No reviews yet. Start by reviewing your first cigar!</p>
      </div>
    ),
    [TABS.achievements]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">
          My Achievements
        </h2>
        <p>Complete activities to earn achievements!</p>
      </div>
    ),
    [TABS.subscription]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">
          My Subscription
        </h2>
        <p>Upgrade to Premium to unlock all features!</p>
      </div>
    ),
  };

  const tabs = [
    { id: TABS.humidor, label: "Humidor", icon: Box },
    { id: TABS.reviews, label: "Reviews", icon: Star },
    { id: TABS.achievements, label: "Achievements", icon: Award },
    { id: TABS.subscription, label: "Subscription", icon: Crown },
  ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)]">
      {/* Profile component */}
      <div className="bg-[#222222] rounded-3xl w-full p-3 md:p-5 flex flex-col md:flex-row flex-1 min-h-0 mb-16 md:mb-0">
        {/* Left sidebar */}
        <div className="w-full md:w-[25%] bg-[#333333] mb-4 md:mb-0 md:mr-2 rounded-3xl p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-center">
                <div className="mt-4 md:mt-10 relative w-20 md:w-24 h-20 md:h-24 rounded-full overflow-hidden border border-gray-600">
                  {profile?.user.profileImageUrl ? (
                    <Image
                      src={profile.user?.profileImageUrl}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <UserCircle className="w-8 md:w-12 h-8 md:h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="text-[#FFFFFF] text-center mt-3 md:mt-5 font-semibold break-words px-4">
                  {profile.user.fullName}
                </div>

                <div className="flex items-center justify-center text-[#B9B9B9] text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>New York, USA</span>
                </div>

                <div className="flex justify-center space-x-2">
                  <div title="Master Roller">
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div title="Flavor Expert">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <div title="Collector">
                    <Award className="w-6 h-6 text-green-500" />
                  </div>
                </div>

                <div className="flex justify-center space-x-4 text-[#B9B9B9] text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>128 followers</span>
                  </div>
                  <div className="text-[#666666]">|</div>
                  <div>
                    <span>89 following</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#EFA427] hover:bg-[#222222] hover:text-[#EFA427] text-[#010101] rounded-full py-2 text-sm transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main content area with tabs */}
        <div className="w-full md:w-[75%] h-full rounded-3xl p-4 pt-0">
          {/* Tabs */}
          <div className="flex space-x-3 rounded-xl bg-[#222222] p-1 mb-4">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={`/dashboard?tab=${tab.id}`}
                  className={`
                    flex space-x-2  rounded-3xl px-4 py-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-[#EFA427] text-[#222222]"
                        : "bg-[#363636] text-[#EFA427] hover:bg-[#EFA427] hover:text-[#222222]"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Tab content */}
          {tabContent[currentTab]}
        </div>
      </div>
    </div>
  );
}
