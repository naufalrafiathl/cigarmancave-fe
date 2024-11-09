import { getUserProfile } from "@/lib/api";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  UserCircle,
  Search,
  Moon,
  Bell,
  Info,
  MapPin,
  Award,
  Users,
  Mail,
  Calendar,
  Crown,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  const profile = await getUserProfile();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)]">
      {/* Search bar */}
      <div className="bg-[#222222] rounded-full w-full p-3 md:p-5 mb-3 shrink-0">
        <div className="flex items-center justify-between gap-4">
          {/* Search with icon */}
          <div className="relative w-1/4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-[#B9B9B9]" />
              <input
                className="bg-[#3C3D3E] rounded-full p-2 pl-10 w-full focus:outline-none text-[#B9B9B9]"
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right side icons grouped together */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
              <Moon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile component */}
      <div className="bg-[#222222] rounded-3xl w-full p-3 md:p-5 flex flex-col md:flex-row flex-1 min-h-0 mb-16 md:mb-0">
      <div className="w-full md:w-[25%] bg-[#333333] mb-4 md:mb-0 md:mr-2 rounded-3xl p-4 h-full">
  <div className="flex flex-col h-full">
    <div className="flex-1">
      {/* Image container */}
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

      {/* Profile Details */}
      <div className="flex flex-col space-y-4">
        {/* Name - now wraps text */}
        <div className="text-[#FFFFFF] text-center mt-3 md:mt-5 font-semibold break-words px-4">
          {profile.user.fullName}
        </div>

        {/* Location */}
        <div className="flex items-center justify-center text-[#B9B9B9] text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>New York, USA</span>
        </div>

        {/* Badges */}
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

        {/* Followers/Following */}
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

    {/* Edit Profile Button */}
    <button className="w-full bg-[#EFA427] hover:bg-[#222222] hover:text-[#EFA427] text-[#010101] rounded-full py-2 text-sm transition-colors">
      Edit Profile
    </button>
  </div>
</div>
        <div className="w-full md:w-[75%] h-full rounded-2xl p-4">Page</div>
      </div>
    </div>
  );
}
