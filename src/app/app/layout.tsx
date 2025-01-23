// src/app/app/layout.tsx
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/api";
import { Sidebar } from "../../components/layout/Sidebar";
import { MobileNav } from "../../components/layout/MobileNav";
import { SearchHeader } from "./profile/components/SearchHeader";
import { Metadata, Viewport } from 'next';

// Define viewport settings separately to match the Viewport type
const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Dashboard | Cigar Mancave',
  description: 'Manage your cigar collection and connect with enthusiasts',
  themeColor: '#171717',
  viewport,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cigar Mancave'
  },
  // Add other meta tags
  alternates: {
    canonical: '/app'
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  const profile = await getUserProfile();

  return (
    <div className="min-h-screen bg-[#171717]">
      {/* iOS PWA Status Bar Spacer */}
      <div 
        className="h-[env(safe-area-inset-top)] bg-[#171717] fixed top-0 left-0 right-0 z-50" 
        style={{ 
          display: 'var(--pwa-display, none)',
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)'
        }}
      />

      <Sidebar profile={profile} />
      <MobileNav profile={profile} />

      <div className="md:ml-64">
        <main className="p-4 md:ml-4">
          <SearchHeader />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}