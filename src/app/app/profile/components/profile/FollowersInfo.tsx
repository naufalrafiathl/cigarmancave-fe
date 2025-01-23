export function FollowersInfo() {
  return (
    <div className="flex flex-col items-center justify-center py-3">
      <div className="relative group">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-amber-500 font-medium">Coming Soon</span>
        </div>
        <p className="text-neutral-400 text-xs mt-1.5 text-center">
          Connect with fellow learners
        </p>
      </div>
    </div>
  );
}