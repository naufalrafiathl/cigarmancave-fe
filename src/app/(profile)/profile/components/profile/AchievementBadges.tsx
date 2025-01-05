export function AchievementBadges() {
  return (
    <div className="flex justify-center space-x-4">
      <div title="Flavor Expert">
        <img 
          src="/achievements/start.png" 
          alt="First Light Achievement" 
          className="w-10 h-13"
        />
      </div>
      <div title="Master Roller">
        <img 
          src="/achievements/beta.png" 
          alt="Beta Achievement" 
          className="w-10 h-13"
        />
      </div>
      <div title="Collector">
        <img 
          src="/achievements/firststeps.png" 
          alt="First Steps Achievement" 
          className="w-10 h-13"
        />
      </div>
    </div>
  );
}