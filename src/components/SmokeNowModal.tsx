"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useCigarOperations } from "@/hooks/useCigarOperations";
import { toast } from "sonner";
import Link from "next/link";

interface SearchResult {
  brandName: string;
  lineName: string;
  similarity: number;
  variants: {
    id: number;
    length: number;
    ringGauge: number;
    wrapper: string;
    strength: string | null;
  }[];
}

interface SmokeNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCigar: (cigar: { id: number; name: string; brand: string }) => void;
}

export function SmokeNowModal({ isOpen, onClose, onSelectCigar }: SmokeNowModalProps) {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { searchCigars, createCigar, isLoading: isSearching } = useCigarOperations();

  const [newCigarData, setNewCigarData] = useState({
    name: "",
    brand: "",
  });

  const debouncedSearch = useDebounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchCigars({ query });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  }, 300);

  const handleCreateCigar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCigar = await createCigar(newCigarData);
      onSelectCigar({
        id: createdCigar.id,
        name: createdCigar.name,
        brand: createdCigar.brand.name,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create cigar");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#2A2A2A] rounded-xl mx-4 p-6 w-full max-w-md border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Smoke Now</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>

        {!isManualEntry ? (
          <>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for a cigar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  className="pl-10 w-full h-12 bg-[#222222] border border-white/10 rounded-xl text-white"
                />
              </div>
              <button
                onClick={() => setIsManualEntry(true)}
                className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
              >
                Manual Entry
              </button>
            </div>

            <div className="mb-4">
              <Link
                href="/app/profile?tab=humidor"
                className="block w-full px-4 py-3 text-center text-[#B9B9B9] bg-[#222222] rounded-xl border border-white/10 hover:bg-[#222222]/70 transition-colors"
                onClick={onClose}
              >
                Or Smoke From Humidor
              </Link>
            </div>

            {isSearching ? (
              <div className="mt-4 text-center text-white/60">Searching...</div>
            ) : (
              <div className="mt-4 max-h-60 overflow-y-auto border border-white/10 rounded-xl">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectCigar({
                      id: result.variants[0].id,
                      name: result.lineName,
                      brand: result.brandName,
                    })}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
                  >
                    <div className="text-white font-medium">{result.lineName}</div>
                    <div className="text-sm text-white/60">{result.brandName}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleCreateCigar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">Brand Name *</label>
              <input
                type="text"
                value={newCigarData.brand}
                onChange={(e) => setNewCigarData({ ...newCigarData, brand: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">Line Name *</label>
              <input
                type="text"
                value={newCigarData.name}
                onChange={(e) => setNewCigarData({ ...newCigarData, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsManualEntry(false)}
                className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-xl hover:bg-white/5"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
              >
                Create & Select
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}