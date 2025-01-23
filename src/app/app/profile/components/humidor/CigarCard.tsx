import React from "react";
import { Edit2, Trash2, MoreVertical, BookOpen } from "lucide-react";
import { CigarDisplay, Cigar } from "@/types/humidor";
import { calculateAgingDays } from "@/lib/calculateAgingDays";
import Image from "next/image";

interface CigarCardProps {
  humidorCigar: CigarDisplay;
  cigar: Cigar;
  viewMode: "grid" | "list";
  onEdit: (cigar: CigarDisplay) => void;
  onDelete: (cigar: CigarDisplay) => void;
  onView: (cigar: CigarDisplay) => void;
  onReview: (cigar: CigarDisplay) => void;
}

export function CigarCard({
  humidorCigar,
  cigar,
  viewMode,
  onEdit,
  onDelete,
  onView,
  onReview,
}: CigarCardProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("button")) {
      onView(humidorCigar);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(humidorCigar);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (
      window.confirm(
        "Are you sure you want to remove this cigar from your humidor?"
      )
    ) {
      onDelete(humidorCigar);
    }
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onReview(humidorCigar);
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Dropdown Menu Content
  const DropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-xl shadow-lg z-10 border border-white/10 overflow-hidden">
      <button
        onClick={handleEditClick}
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2"
      >
        <Edit2 className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={handleDeleteClick}
        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Remove
      </button>
    </div>
  );

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl border border-white/10 p-6 hover:border-[#EFA427] transition-all duration-300 cursor-pointer group"
      >
        <div className="flex gap-8">
          {/* Left: Image */}
          <div className="w-40 h-40 bg-black/40 rounded-xl overflow-hidden flex-shrink-0 relative">
            {/* Quantity Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-black/60 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
                Quantity:{humidorCigar.quantity}
              </span>
            </div>

            {humidorCigar.imageUrl ? (
              <Image
                src={humidorCigar.imageUrl}
                alt={humidorCigar.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-black/40 to-black/20">
                No Image
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-white text-xl mb-1">
                  {humidorCigar.name}
                </h3>
                <p className="text-[#EFA427] font-medium text-lg">
                  {humidorCigar.brand}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showDropdown && <DropdownMenu />}
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-black/20 rounded-xl p-2.5">
                <span className="text-gray-400 text-sm">Size</span>
                <p className="text-white font-medium">
                  {cigar.length}" × {cigar.ringGauge}
                </p>
              </div>
              <div className="bg-black/20 rounded-xl p-2.5">
                <span className="text-gray-400 text-sm">Strength</span>
                <p className="text-white font-medium">{cigar.strength}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-2.5">
                <span className="text-gray-400 text-sm">Origin</span>
                <p className="text-white font-medium">{cigar.country}</p>
              </div>
              {humidorCigar.purchaseDate && (
                <div className="bg-black/20 rounded-xl p-2.5">
                  <span className="text-gray-400 text-sm">Aging</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-medium">
                      {calculateAgingDays(humidorCigar.purchaseDate)}
                    </span>
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Notes */}
            <div className="flex gap-4 mb-4">
              {humidorCigar.purchasePrice && (
                <div className="flex-1 bg-black/20 rounded-xl p-2.5">
                  <span className="text-gray-400 text-sm">Price Details</span>
                  <div className="text-[#EFA427] font-medium">
                    ${humidorCigar.purchasePrice.toFixed(2)}/stick
                    <span className="text-white text-sm ml-2">
                      (Total: $
                      {(
                        humidorCigar.purchasePrice * humidorCigar.quantity
                      ).toFixed(2)}
                      )
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes & Review Button */}
            <div className="flex items-end justify-between mt-auto">
              {humidorCigar.notes && (
                <div className="flex-1 bg-black/20 rounded-xl p-2.5 mr-4">
                  <span className="text-gray-400 text-sm">Notes</span>
                  <p className="text-white text-sm line-clamp-2 mt-1">
                    {humidorCigar.notes}
                  </p>
                </div>
              )}
              <button
                onClick={handleReviewClick}
                className="px-6 py-2.5 bg-[#EFA427] text-black font-medium rounded-xl hover:bg-[#EFA427]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-5 h-5" />
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#EFA427] transition-all duration-300 shadow-lg group flex flex-col"
    >
      {/* Image Section */}
      <div className="h-64 bg-black/40 relative">
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-black/60 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
            Quantity: {humidorCigar.quantity}
          </span>
        </div>
        {humidorCigar.imageUrl ? (
          <Image
            src={humidorCigar.imageUrl}
            alt={humidorCigar.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-black/40 to-black/20">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white text-lg mb-1">
              {humidorCigar.name}
            </h3>
            <p className="text-[#EFA427] font-medium">{humidorCigar.brand}</p>
          </div>
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showDropdown && <DropdownMenu />}
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-black/20 rounded-xl p-2">
            <span className="text-gray-400 text-xs">Size</span>
            <p className="text-white text-sm">
              {cigar.length}" × {cigar.ringGauge}
            </p>
          </div>
          <div className="bg-black/20 rounded-xl p-2">
            <span className="text-gray-400 text-xs">Strength</span>
            <p className="text-white text-sm">{cigar.strength}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-2">
            <span className="text-gray-400 text-xs">Origin</span>
            <p className="text-white text-sm">{cigar.country}</p>
          </div>
        </div>

        {/* Price & Aging */}
        <div className="flex flex-col gap-2 mb-3">
          {humidorCigar.purchaseDate && (
            <div className="bg-black/20 rounded-xl p-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Aging</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-medium">
                  {calculateAgingDays(humidorCigar.purchaseDate)}
                </span>
                <span className="text-gray-400 text-sm">days</span>
              </div>
            </div>
          )}
          {humidorCigar.purchasePrice && (
            <div className="bg-black/20 rounded-xl p-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Purchase Price</span>
              <div className="text-[#EFA427] font-medium text-sm">
                ${humidorCigar.purchasePrice.toFixed(2)}/stick
              </div>
            </div>
          )}
        </div>

        {/* Notes (if they exist) */}
        {humidorCigar.notes && (
          <div className="mb-3">
            <p className="text-gray-400 text-sm line-clamp-2">
              {humidorCigar.notes}
            </p>
          </div>
        )}

        {/* Review Button */}
        <button
          onClick={handleReviewClick}
          className="w-full bg-[#EFA427] text-black font-medium py-2.5 px-4 rounded-xl hover:bg-[#EFA427]/90 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Write Review
        </button>
      </div>
    </div>
  );
}
