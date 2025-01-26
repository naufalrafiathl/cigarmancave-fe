import { getUserProfile } from "@/lib/api";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { ProfileTabs } from "../components/ProfileTabs";
import { TabContent } from "../components/TabContent";
import { isValidTab, TABS, TabType } from "@/types/profile";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export default async function ProfilePage({
  params,
  searchParams,
}: PageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  const profile = await getUserProfile();
  const resolvedSearchParams = await searchParams;
  
  // Get the tab from searchParams and validate it
  const tab = typeof resolvedSearchParams.tab === 'string' 
    ? resolvedSearchParams.tab 
    : undefined;
    
  const currentTab = isValidTab(tab) ? tab as TabType : TABS.humidor;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-8rem)]">
      <div className="bg-[#222222] rounded-3xl w-full p-3 md:p-5 flex flex-col md:flex-row flex-1 mb-16 md:mb-0">
        <div className="w-full md:w-[75%] rounded-3xl p-0 lg:p-4 pt-1 lg:pt-0">
          <ProfileTabs currentTab={currentTab} isMobile={true}/>
          <TabContent currentTab={currentTab} />
        </div>
      </div>
    </div>
  );
}