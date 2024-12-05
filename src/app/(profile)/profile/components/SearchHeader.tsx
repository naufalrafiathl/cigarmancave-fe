// src/app/(dashboard)/components/SearchHeader.tsx
import { Search, Moon, Bell, Info } from "lucide-react";

export function SearchHeader() {
  return (
    <div className="bg-[#222222] rounded-full w-full p-3 md:p-5 mb-3 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-1/2 xl:w-1/4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-[#B9B9B9]" />
            <input
              className="bg-[#3C3D3E] rounded-full p-2 pl-10 w-full focus:outline-none text-[#B9B9B9]"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
            <Moon className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}