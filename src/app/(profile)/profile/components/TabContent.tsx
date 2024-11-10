// src/components/profile/TabContent.tsx
import { TabType, TABS } from "@/types/profile";
import { HumidorView } from "./humidor/HumidorView";

interface TabContentProps {
  currentTab: TabType;
}

export function TabContent({ currentTab }: TabContentProps) {
  const tabContent: Record<TabType, JSX.Element> = {
    [TABS.humidor]: (
      <HumidorView></HumidorView>
    ),
    [TABS.reviews]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">My Reviews</h2>
        <p>No reviews yet. Start by reviewing your first cigar!</p>
      </div>
    ),
    [TABS.achievements]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">My Achievements</h2>
        <p>Complete activities to earn achievements!</p>
      </div>
    ),
    [TABS.subscription]: (
      <div className="p-4 text-[#B9B9B9]">
        <h2 className="text-xl font-semibold text-white mb-4">My Subscription</h2>
        <p>Upgrade to Premium to unlock all features!</p>
      </div>
    ),
  };

  return tabContent[currentTab];
}