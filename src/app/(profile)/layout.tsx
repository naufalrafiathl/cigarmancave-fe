import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/api";
import { Sidebar } from "../../components/layout/Sidebar";
import { MobileNav } from "../../components/layout/MobileNav";
import { SearchHeader } from "./profile/components/SearchHeader";

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
