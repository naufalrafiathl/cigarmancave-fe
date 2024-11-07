import { getSession } from '@auth0/nextjs-auth0';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile } from '@/lib/api';

export default async function ProfilePage() {
  const session = await getSession();
  const profile = await getUserProfile();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={profile.picture || session.user.picture || '/placeholder-avatar.png'}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {profile.fullName || session.user.name}
                </h2>
                <p className="text-sm text-gray-500">{profile.email || session.user.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{profile.email || session.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="text-sm text-gray-900">
                    {profile.isPremium ? 'Premium' : 'Free'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}