// components/humidor/HumidorCard.tsx
import React from 'react';
import { Edit2, Trash2, MoreVertical, Package } from 'lucide-react';

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
  viewMode: 'grid' | 'list';
  onView: (humidor: Humidor) => void;
  onEdit: (humidor: Humidor) => void;
  onDelete: (humidor: Humidor) => void;
}

export function HumidorCard({ 
  humidor, 
  viewMode, 
  onView, 
  onEdit, 
  onDelete 
}: HumidorCardProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(humidor);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (window.confirm('Are you sure you want to delete this humidor?')) {
      onDelete(humidor);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onView(humidor)}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {humidor.imageUrl ? (
              <img 
                src={humidor.imageUrl} 
                alt={humidor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{humidor.name}</h3>
            {humidor.description && (
              <p className="text-sm text-gray-500 line-clamp-1">{humidor.description}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              {humidor.cigars.length} cigars
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          
          {showDropdown && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onView(humidor)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
    >
      <div className="h-48 bg-gray-200">
        {humidor.imageUrl ? (
          <img 
            src={humidor.imageUrl} 
            alt={humidor.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{humidor.name}</h3>
            {humidor.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {humidor.description}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              {humidor.cigars.length} cigars
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}