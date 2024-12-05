"use client"

import { useState } from 'react';
import Link from "next/link";
import { Box, Star, Award, Crown, ChevronDown } from "lucide-react";
import { TABS, TabType } from "@/types/profile";

interface ProfileTabsProps {
  currentTab: TabType;
}

export function ProfileTabs({ currentTab }: ProfileTabsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = [
    { id: TABS.humidor, label: "Humidor", icon: Box },
    { id: TABS.reviews, label: "Reviews", icon: Star },
    { id: TABS.achievements, label: "Achievements", icon: Award },
    { id: TABS.subscription, label: "Subscription", icon: Crown },
  ] as const;

  const currentTabInfo = tabs.find(tab => tab.id === currentTab);
  const CurrentIcon = currentTabInfo?.icon;

  return (
    <div className="mb-4">
      {/* Mobile/Tablet Dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between rounded-xl bg-[#363636] px-4 py-3 text-[#EFA427]"
        >
          <div className="flex items-center space-x-2">
            {CurrentIcon && <CurrentIcon className="w-4 h-4" />}
            <span className="font-medium">{currentTabInfo?.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#222222] rounded-xl overflow-hidden shadow-lg z-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              if (isActive) return null;
              
              return (
                <Link
                  key={tab.id}
                  href={`/profile?tab=${tab.id}`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 text-[#EFA427] hover:bg-[#363636] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-3 rounded-xl bg-[#222222] p-1">
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
    </div>
  );
}