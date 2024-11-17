import { Cigar } from "@/types/humidor";

interface CigarCardProps {
  cigar: Cigar;
  viewMode?: 'grid' | 'list';
}

export function CigarCard({ cigar, viewMode = 'grid' }: CigarCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="truncate flex-1">
            <h3 className="text-lg font-semibold text-white truncate">
              {cigar.name}
            </h3>
            <p className="text-[#B9B9B9] text-sm truncate mt-1">
              {cigar.brand}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-[#B9B9B9]">Quantity</p>
              <p className="text-lg font-semibold text-white">
                {cigar.quantity}
              </p>
            </div>
            {/* Add any additional badges or indicators here */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10 flex flex-col">
      <h3 className="text-lg font-semibold text-white truncate mb-2">
        {cigar.name}
      </h3>
      <p className="text-[#B9B9B9] text-sm truncate flex-1">
        {cigar.brand}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#B9B9B9]">Quantity</p>
          <p className="text-lg font-semibold text-white">
            {cigar.quantity}
          </p>
        </div>
        {/* Add any additional badges or indicators here */}
      </div>
    </div>
  );
}