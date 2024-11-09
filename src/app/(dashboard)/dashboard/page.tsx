// src/app/(dashboard)/dashboard/page.tsx
import { getUserProfile } from '@/lib/api';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/api/auth/login');
  }

  const profile = await getUserProfile();
  console.log(profile)
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Search bar */}
      <div className='bg-[#222222] rounded-full w-full p-5 mb-3 shrink-0'>
        <div className='flex text-[#B9B9B9]'>
          <div>Search</div>
          <div>Icons</div>
        </div>
      </div>
      
      {/* Profile component */}
      <div id="profcomp" className="bg-[#222222] rounded-2xl w-full p-5 flex flex-1 min-h-0">
        <div className="w-[25%] bg-[#333333] mr-2 rounded-2xl p-4">
          {/* Image container with fixed width and centered */}
          <div className="flex justify-center">
            <div className="mt-10 relative w-24 h-24 rounded-full overflow-hidden border border-gray-600">
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
                  <UserCircle className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
          </div>
          <div className='text-[#FFFFFF] text-center mt-5'>{profile.user.fullName}</div>
        </div>
        <div className="w-[75%] h-full rounded-2xl p-4">
          Page
        </div>
      </div>
    </div>
  );
}