import React from "react";
import { Edit2, Trash2, Cigarette, DollarSign, Package } from "lucide-react";

interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  cigars: {
    id: number;
    name: string;
    brand: string;
    quantity?: number;
    purchasePrice?: number;
  }[];
}

interface HumidorCardProps {
  humidor: Humidor;
  viewMode: "grid" | "list";
  onSelect: (humidor: Humidor) => void;
  onView: (humidor: Humidor) => void;
  onEdit: (humidor: Humidor) => void;
  onDelete: (humidor: Humidor) => void;
}

export function HumidorCard({
  humidor,
  viewMode,
  onView,
  onSelect,
  onEdit,
  onDelete,
}: HumidorCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(humidor);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this humidor?")) {
      onDelete(humidor);
    }
  };

  // Calculate total value of cigars (if price data is available)
  const totalValue = humidor.cigars.reduce((sum, cigar) => {
    return sum + ((cigar.purchasePrice || 0) * (cigar.quantity || 1));
  }, 0);

  return (
    <div className="bg-[#2A2A2A] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#EFA427] transition-all duration-300 shadow-lg">
      {/* Image Header */}
      <div className="relative h-48">
        {humidor.imageUrl ? (
          <img
            src={humidor.imageUrl}
            alt={humidor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#1A1A1A]">
            <Package className="w-12 h-12 text-[#EFA427]/40" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Cigar Count Badge */}
          <div className="group relative bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
            <Cigarette className="w-4 h-4 text-[#EFA427] mr-1.5" />
            <span className="text-white text-sm font-medium">
              {humidor.cigars.length}
            </span>
            {/* Hover tooltip */}
            <div className="absolute invisible group-hover:visible -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              {humidor.cigars.length} {humidor.cigars.length === 1 ? 'cigar' : 'cigars'}
            </div>
          </div>
          {/* Total Value Badge */}
          {totalValue > 0 && (
            <div className="group relative bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
              <DollarSign className="w-4 h-4 text-green-400 mr-1.5" />
              <span className="text-white text-sm font-medium">
                {totalValue.toFixed(2)}
              </span>
              {/* Hover tooltip */}
              <div className="absolute invisible group-hover:visible -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                Total Value
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-white font-bold text-lg tracking-tight">
              {humidor.name}
            </h3>
            {humidor.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {humidor.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onView(humidor)}
            className="flex-1 bg-[#EFA427] hover:bg-amber-600 text-black text-md py-2 px-4 rounded-xl transition-colors"
          >
            View Humidor
          </button>
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222222] rounded-xl transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-[#222222] rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}