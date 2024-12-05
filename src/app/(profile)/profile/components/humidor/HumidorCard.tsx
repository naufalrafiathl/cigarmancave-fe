import { Humidor } from "@/types/humidor";

interface HumidorCardProps {
  humidor: Humidor;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

export function HumidorCard({ humidor, onClick, viewMode = 'grid' }: HumidorCardProps) {
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 truncate">
            <h3 className="text-lg font-semibold text-white truncate">
              {humidor.name}
            </h3>
            <p className="text-[#B9B9B9] text-sm truncate mt-1">
              {humidor.description}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-[#B9B9B9]">Total Cigars</p>
              <p className="text-lg font-semibold text-white">
                {humidor.cigars.length}
              </p>
            </div>
            {humidor.type === 'premium' && (
              <span className="px-3 py-1 bg-[#EFA427] text-white text-sm font-medium rounded-full">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10 flex flex-col"
    >
      <h3 className="text-lg font-semibold text-white truncate mb-2">
        {humidor.name}
      </h3>
      <p className="text-[#B9B9B9] text-sm truncate flex-1">
        {humidor.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#B9B9B9]">Total Cigars</p>
          <p className="text-lg font-semibold text-white">
            {humidor.cigars.length}
          </p>
        </div>
        {humidor.type === 'premium' && (
          <span className="px-3 py-1 bg-[#EFA427] text-white text-sm font-medium rounded-full">
            Premium
          </span>
        )}
      </div>
    </div>
  );
}