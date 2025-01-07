// src/components/profile/TabContent.tsx
import { TabType, TABS } from "@/types/profile";
import { HumidorView } from "./HumidorView";
import { ReviewsView } from "./ReviewView";
import { AchievementView } from "./AchievementView";

interface TabContentProps {
  currentTab: TabType;
}

export function TabContent({ currentTab }: TabContentProps) {
  const tabContent: Record<TabType, JSX.Element> = {
    [TABS.humidor]: (
      <div className="overflow-y-auto">
        <HumidorView></HumidorView>
      </div>
    ),
    [TABS.reviews]: (
      <div className="overflow-y-auto">
        <ReviewsView></ReviewsView>
      </div>
    ),
    [TABS.achievements]: (
      <div className="overflow-y-auto">
        <AchievementView></AchievementView>
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

  return tabContent[currentTab];
}
