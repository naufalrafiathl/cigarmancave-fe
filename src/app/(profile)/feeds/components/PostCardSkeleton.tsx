export const PostCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl border border-white/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-square rounded-lg bg-white/10 animate-pulse" />
        <div className="aspect-square rounded-lg bg-white/10 animate-pulse" />
      </div>

      <div className="flex items-center gap-6 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
          <div className="w-8 h-4 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
          <div className="w-8 h-4 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
