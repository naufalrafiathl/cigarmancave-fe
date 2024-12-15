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

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onView(humidor)}
        className="bg-[#2A2A2A] rounded-lg border border-white/10 p-4 flex items-center justify-between cursor-pointer hover:border-[#EFA427] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#222222] rounded-lg overflow-hidden flex-shrink-0">
            {humidor.imageUrl ? (
              <img
                src={humidor.imageUrl}
                alt={humidor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">{humidor.name}</h3>
            {humidor.description && (
              <p className="text-sm text-[#B9B9B9] line-clamp-1 mt-1">
                {humidor.description}
              </p>
            )}
            <div className="flex items-center text-sm text-[#B9B9B9] mt-2">
              <Package className="w-4 h-4 mr-1" />
              {humidor.cigars.length} cigars
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="p-2 text-white hover:text-[#EFA427] hover:bg-white/5 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onView(humidor)}
      className="bg-[#2A2A2A] rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-[#EFA427] transition-colors"
    >
      <div className="aspect-video bg-[#222222]">
        {humidor.imageUrl ? (
          <img
            src={humidor.imageUrl}
            alt={humidor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {humidor.name}
            </h3>
            {humidor.description && (
              <p className="text-sm text-[#B9B9B9] line-clamp-2 mt-1">
                {humidor.description}
              </p>
            )}
            <div className="flex items-center text-sm text-[#B9B9B9] mt-2">
              <Package className="w-4 h-4 mr-1" />
              {humidor.cigars.length} cigars
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-2 text-white hover:text-[#EFA427] hover:bg-white/5 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
