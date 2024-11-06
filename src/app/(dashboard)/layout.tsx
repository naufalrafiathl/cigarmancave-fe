// src/app/(dashboard)/layout.tsx
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, UserCircle, LogOut } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-4 border-b">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Mancave
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <UserCircle className="w-5 h-5 mr-3" />
              Profile
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={session.user.picture || '/placeholder-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <a
                href="/api/auth/logout"
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}