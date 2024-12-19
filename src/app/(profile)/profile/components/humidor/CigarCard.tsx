import React from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { CigarDisplay } from '@/types/humidor';

interface CigarCardProps {
  cigar: CigarDisplay;
  viewMode: 'grid' | 'list';
  onEdit: (cigar: CigarDisplay) => void;
  onDelete: (cigar: CigarDisplay) => void;
  onView: (cigar: CigarDisplay) => void;
}

export function CigarCard({ cigar, viewMode, onEdit, onDelete, onView }: CigarCardProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(cigar);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (window.confirm('Are you sure you want to remove this cigar from your humidor?')) {
      onDelete(cigar);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onView(cigar)}
        className="bg-[#2A2A2A] rounded-lg border border-white/10 p-4 flex items-center justify-between hover:border-[#EFA427] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#222222] rounded-lg overflow-hidden">
            {cigar.imageUrl ? (
              <img 
                src={cigar.imageUrl} 
                alt={cigar.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{cigar.name}</h3>
            <p className="text-sm text-[#B9B9B9]">{cigar.brand}</p>
            <p className="text-sm text-[#B9B9B9] mt-1">Quantity: {cigar.quantity}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-white hover:text-[#EFA427] hover:bg-white/5 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-md shadow-lg z-10 border border-white/10">
              {/* <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button> */}
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onView(cigar)}
      className="bg-[#2A2A2A] rounded-lg border border-white/10 overflow-hidden hover:border-[#EFA427] transition-colors cursor-pointer"
    >
      <div className="h-48 bg-[#222222]">
        {cigar.imageUrl ? (
          <img 
            src={cigar.imageUrl} 
            alt={cigar.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">{cigar.name}</h3>
            <p className="text-sm text-[#B9B9B9]">{cigar.brand}</p>
            <p className="text-sm text-[#B9B9B9] mt-1">Quantity: {cigar.quantity}</p>
            {cigar.purchasePrice && (
              <p className="text-sm text-[#B9B9B9]">
                Price: ${cigar.purchasePrice.toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-white hover:text-[#EFA427] hover:bg-white/5 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-md shadow-lg z-10 border border-white/10">
                {/* <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button> */}
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        
        {cigar.notes && (
          <p className="text-sm text-[#B9B9B9] mt-2 line-clamp-2">{cigar.notes}</p>
        )}
      </div>
    </div>
  );
}