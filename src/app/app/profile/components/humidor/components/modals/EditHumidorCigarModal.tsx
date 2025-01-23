"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Camera, Upload, Trash, Loader2 } from "lucide-react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDebounce } from "@/hooks/useDebounce";
import { useCigarOperations } from "@/hooks/useCigarOperations";
import { useImageUpload } from "@/hooks/useImageUploadOperations";
import { validateFile } from "@/utils/validateFIle";
import Image from "next/image";
import { toast } from "sonner";
import { CreateCigarRequest } from "@/hooks/useCigarOperations";

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
  imageUrl?: string;
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

interface CropModalProps {
  imageUrl: string;
  onCrop: (croppedImage: string) => void;
  onClose: () => void;
}

const ImageCropModal = ({ imageUrl, onCrop, onClose }: CropModalProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    onCrop(base64Image);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-[#2A2A2A] p-6 rounded-xl max-w-2xl w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">Adjust Image</h3>

        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-xl hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={getCroppedImg}
            className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditHumidorCigarModal({
  humidorCigar,
  onSubmit,
  onClose,
}: EditHumidorCigarModalProps) {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState<
    HumidorCigar & {
      brandName?: string;
      lineName?: string;
      length?: number;
      ringGauge?: number;
      strength?: string;
    }
  >({
    quantity: humidorCigar?.quantity || 1,
    purchasePrice: humidorCigar?.purchasePrice,
    purchaseDate:
      humidorCigar?.purchaseDate ?? new Date().toISOString().split("T")[0],
    purchaseLocation: humidorCigar?.purchaseLocation || "",
    notes: humidorCigar?.notes || "",
  });

  const [newCigarData, setNewCigarData] = useState<CreateCigarRequest>({
    name: "",
    brand: "",
    length: null,
    ringGauge: null,
    wrapper: null,
    strength: null,
  });

  const {
    searchCigars,
    createCigar,
    isLoading: isSearching,
  } = useCigarOperations();
  const { directUpload, isUploading, error: uploadError } = useImageUpload();

  const [cigarImage, setCigarImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    humidorCigar?.imageUrl || ""
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = humidorCigar?.imageUrl;
      let cigarId = selectedVariant?.id || humidorCigar?.cigarId;

      if (isManualEntry) {
        // Create a new cigar entry
        const newCigar = await createCigar({
          name: formData.lineName!,
          brand: formData.brandName!,
          length: formData.length,
          ringGauge: formData.ringGauge,
          strength: formData.strength,
        });
        cigarId = newCigar.id;
      }

      if (cigarImage) {
        const response = await directUpload({
          file: cigarImage,
          generateVariants: true,
          folder: "humidor",
        });
        uploadedImageUrl = response.data.original;
      }

      onSubmit({
        ...formData,
        cigarId,
        imageUrl: uploadedImageUrl,
        variantId: selectedVariant?.id,
      });

      onClose();
    } catch (error) {
      toast.error("Failed to update cigar");
      console.error("Error:", error);
    }
  };

  const handleCreateCigar = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const createdCigar = await createCigar(newCigarData);
      toast.success("Cigar created successfully!");
      setIsManualEntry(false);
      
      const searchResult: SearchResult = {
        brandName: createdCigar.brand.name,
        lineName: createdCigar.name,
        similarity: 1,
        variants: [{
          id: createdCigar.id,
          length: createdCigar.length || 0,
          ringGauge: createdCigar.ringGauge || 0,
          wrapper: createdCigar.wrapper || "",
          strength: createdCigar.strength || null,
        }]
      };
  
      setSelectedResult(searchResult);
      setSelectedVariant(searchResult.variants[0]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create cigar"
      );
    }
  };
  

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError.message);
    }
  }, [uploadError]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div
        className={`bg-[#2A2A2A] rounded-xl mx-4 p-6 w-full max-w-md border border-white/10 ${
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
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
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
                  className="pl-10 w-full h-12 bg-[#222222] border border-white/10 rounded-xl text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsManualEntry(true)}
                className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
              >
                Manual Entry
              </button>
            </div>

            {isSearching ? (
              <div className="mt-4 text-center text-white/60">Searching...</div>
            ) : searchResults.length > 0 && !selectedResult ? (
              <div className="mt-4 max-h-60 overflow-y-auto border border-white/10 rounded-xl">
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
        

        {/* Manual Entry Modal */}
        {isManualEntry && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-[#2A2A2A] rounded-xl mx-4 p-6 w-full max-w-md border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Create New Cigar
                </h2>
                <button
                  onClick={() => setIsManualEntry(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCigar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={newCigarData.brand}
                    onChange={(e) =>
                      setNewCigarData({
                        ...newCigarData,
                        brand: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                    Line Name *
                  </label>
                  <input
                    type="text"
                    value={newCigarData.name}
                    onChange={(e) =>
                      setNewCigarData({ ...newCigarData, name: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                      Length (inches) (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={newCigarData.length || ""}
                      onChange={(e) =>
                        setNewCigarData({
                          ...newCigarData,
                          length: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B9B9B9] mb-1.5">
                      Ring Gauge (Optional)
                    </label>
                    <input
                      type="number"
                      value={newCigarData.ringGauge || ""}
                      onChange={(e) =>
                        setNewCigarData({
                          ...newCigarData,
                          ringGauge: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsManualEntry(false)}
                    className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
                  >
                    Create Cigar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {(selectedResult || humidorCigar) && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {selectedResult && (
              <div className="mb-6 p-4 bg-[#222222] rounded-xl border border-white/10">
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
                          className={`p-2 text-sm rounded-xl border ${
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
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Cigar preview"
                    fill
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#363636] flex items-center justify-center">
                    <Camera className="w-8 h-8 text-[#B9B9B9]" />
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 flex gap-2">
                  <label
                    htmlFor="cigar-image"
                    className="w-8 h-8 bg-[#EFA427] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#EFA427]/90 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </label>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCigarImage(null);
                        setImageUrl("");
                      }}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>

              <input
                id="cigar-image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    try {
                      validateFile(file);
                      const fileUrl = URL.createObjectURL(file);
                      setTempImageUrl(fileUrl);
                      setShowCropModal(true);
                      setCigarImage(file);
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "Invalid file"
                      );
                    }
                  }
                }}
                className="hidden"
              />

              <p className="text-sm text-[#B9B9B9]">
                Recommended: Square image, max 5MB
              </p>
            </div>

            {/* Add the crop modal */}
            {showCropModal && (
              <ImageCropModal
                imageUrl={tempImageUrl}
                onCrop={(croppedImage) => {
                  setImageUrl(croppedImage);
                  setShowCropModal(false);

                  // Convert base64 to File object
                  fetch(croppedImage)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const file = new File([blob], "cropped-image.jpg", {
                        type: "image/jpeg",
                      });
                      setCigarImage(file);
                    });
                }}
                onClose={() => {
                  setShowCropModal(false);
                  URL.revokeObjectURL(tempImageUrl);
                }}
              />
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
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
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
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
              />
            </div>

            {!humidorCigar && (
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
                  className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
                />
              </div>
            )}

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
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white"
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
                className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-white min-h-[100px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-xl hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90 disabled:opacity-50 flex items-center gap-2"
                disabled={(!humidorCigar && !selectedVariant) || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>{humidorCigar ? "Save Changes" : "Add to Humidor"}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
