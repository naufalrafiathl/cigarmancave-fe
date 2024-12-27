import React from "react";
import { Edit2, Trash2, Package, Calendar } from "lucide-react";

interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  cigars: {
    id: number;
    name: string;
    brand: string;
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
            
              <Package className="w-12 h-12 text-[#EFA427]/40" />

          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
          <Package className="w-4 h-4 text-[#EFA427] mr-1.5" />
          <span className="text-white text-sm font-medium">
            {humidor.cigars.length}
          </span>
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
            className="flex-1 bg-[#EFA427] hover:bg-[#EFA427]/90 text-black font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Humidor
          </button>
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222222] rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-[#222222]  rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
