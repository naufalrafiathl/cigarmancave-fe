// src/types/profile.ts
export const TABS = {
    humidor: "humidor",
    reviews: "reviews",
    achievements: "achievements",
    subscription: "subscription",
  } as const;
  
  export type TabType = (typeof TABS)[keyof typeof TABS];
  
  export function isValidTab(tab: string | undefined): tab is TabType {
    return tab !== undefined && Object.values(TABS).includes(tab as TabType);
  }