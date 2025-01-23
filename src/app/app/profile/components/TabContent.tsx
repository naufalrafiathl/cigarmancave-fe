import { TabType, TABS } from "@/types/profile";
import { HumidorView } from "./HumidorView";
import { ReviewsView } from "./ReviewView";
import { AchievementView } from "./AchievementView";
import { SubscriptionView } from "./SubscriptionView";
import { StripeProvider } from "@/providers/StripeProvider";

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
      <div className="overflow-y-auto">
        <StripeProvider>
          <SubscriptionView />
        </StripeProvider>
      </div>
    ),
  };

  return tabContent[currentTab];
}
