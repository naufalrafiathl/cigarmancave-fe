import Link from "next/link";
import { Box, Star, Award, Crown } from "lucide-react";
import { TABS, TabType } from "@/types/profile";

interface ProfileTabsProps {
  currentTab: TabType;
}

export function ProfileTabs({ currentTab }: ProfileTabsProps) {
  const tabs = [
    { id: TABS.humidor, label: "Humidor", icon: Box },
    { id: TABS.reviews, label: "Reviews", icon: Star },
    { id: TABS.achievements, label: "Achievements", icon: Award },
    { id: TABS.subscription, label: "Subscription", icon: Crown },
  ] as const;

  return (
    <div className="flex space-x-3 rounded-xl bg-[#222222] p-1 mb-4">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={`/profile?tab=${tab.id}`}
            className={`
              flex space-x-2 rounded-3xl px-4 py-2 text-sm font-medium transition-colors
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
  );
}