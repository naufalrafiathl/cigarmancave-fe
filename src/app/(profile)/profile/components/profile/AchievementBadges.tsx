export function AchievementBadges() {
  return (
    <div className="flex justify-center space-x-2">
      <div title="Flavor Expert" className="bg-[#222222] rounded-xl">
        <img 
          src="/achievements/start.png" 
          alt="First Light Achievement" 
          className="w-13 h-18"
        />
      </div>
      <div title="Master Roller" className="bg-[#222222] rounded-xl">
        <img 
          src="/achievements/beta.png" 
          alt="Beta Achievement" 
          className="w-13 h-18"
        />
      </div>
      <div title="Collector" className="bg-[#222222] rounded-xl">
        <img 
          src="/achievements/firststeps.png" 
          alt="First Steps Achievement" 
          className="w-13 h-18"
        />
      </div>
    </div>
  );
}