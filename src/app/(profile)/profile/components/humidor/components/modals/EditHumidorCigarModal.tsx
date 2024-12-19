import React, { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useCigarOperations } from "@/hooks/useCigarOperations";

interface Variant {
  id: number;
  length: number;
  ringGauge: number;
  wrapper: string;
  strength: string | null;
}

interface SearchResult {
  brandName: string;
  lineName: string;
  similarity: number;
  variants: Variant[];
}

interface HumidorCigar {
  cigarId?: number;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
}

interface SearchApiResponse {
  type: "SEARCH_RESULTS";
  total: number;
  data: SearchResult[];
}

interface EditHumidorCigarModalProps {
  humidorCigar?: HumidorCigar;
  onSubmit: (data: HumidorCigar & { variantId?: number }) => void;
  onClose: () => void;
}

export default function EditHumidorCigarModal({
  humidorCigar,
  onSubmit,
  onClose,
}: EditHumidorCigarModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState<HumidorCigar>({
    quantity: humidorCigar?.quantity || 1,
    purchasePrice: humidorCigar?.purchasePrice,
    purchaseDate:
      humidorCigar?.purchaseDate ?? new Date().toISOString().split("T")[0],
    purchaseLocation: humidorCigar?.purchaseLocation || "",
    notes: humidorCigar?.notes || "",
  });

  const { searchCigars, isLoading: isSearching } = useCigarOperations();

  const debouncedSearch = useDebounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = (await searchCigars({ query })) as SearchApiResponse;

      if (!response || !response.data || !Array.isArray(response.data)) {
        console.warn("Invalid response format:", response);
        setSearchResults([]);
        return;
      }

      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  }, 300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cigarId: selectedVariant?.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div
        className={`bg-[#2A2A2A] rounded-lg mx-4 p-6 w-full max-w-md border border-white/10 ${
          selectedResult ? "h-[60%] overflow-auto" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {humidorCigar ? "Edit Cigar in Humidor" : "Add Cigar to Humidor"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {!humidorCigar && (
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for a cigar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="pl-10 w-full h-12 bg-[#222222] border border-white/10 rounded-lg text-white"
              />
            </div>

            {isSearching ? (
              <div className="mt-4 text-center text-white/60">Searching...</div>
            ) : searchResults.length > 0 && !selectedResult ? (
              <div className="mt-4 max-h-60 overflow-y-auto border border-white/10 rounded-lg">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedResult(result);
                      setSelectedVariant(result.variants[0]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
                  >
                    <div className="text-white font-medium">
                      {result.lineName}
                    </div>
                    <div className="text-sm text-white/60">
                      {result.brandName}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {(selectedResult || humidorCigar) && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {selectedResult && (
              <div className="mb-6 p-4 bg-[#222222] rounded-lg border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">
                      {selectedResult.lineName}
                    </div>
                    <div className="text-sm text-white/60">
                      {selectedResult.brandName}
                    </div>
                    {selectedVariant && (
                      <div className="mt-2 text-sm text-white/80">
                        {selectedVariant.length}" × {selectedVariant.ringGauge}
                        {selectedVariant.strength &&
                          ` • ${selectedVariant.strength}`}
                        {selectedVariant.wrapper &&
                          ` • ${selectedVariant.wrapper} wrapper`}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResult(null);
                      setSelectedVariant(null);
                    }}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Change
                  </button>
                </div>

                {selectedResult.variants.length > 1 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#B9B9B9] mb-2">
                      Select Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedResult.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-2 text-sm rounded-lg border ${
                            selectedVariant?.id === variant.id
                              ? "border-[#EFA427] bg-[#EFA427]/10 text-white"
                              : "border-white/10 text-white/60 hover:border-white/20"
                          }`}
                        >
                          {variant.length}" × {variant.ringGauge}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                Purchase Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchaseDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                Purchase Location
              </label>
              <input
                type="text"
                value={formData.purchaseLocation}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseLocation: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-lg text-white min-h-[100px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#EFA427] rounded-lg hover:bg-[#d89421] disabled:opacity-50"
                disabled={!humidorCigar && !selectedVariant}
              >
                {humidorCigar ? "Save Changes" : "Add to Humidor"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
