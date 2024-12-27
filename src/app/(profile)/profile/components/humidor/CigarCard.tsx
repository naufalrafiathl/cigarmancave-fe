import React from 'react';
import { Edit2, Trash2, MoreVertical, BookOpen } from 'lucide-react';
import { CigarDisplay,Cigar } from '@/types/humidor';

interface CigarCardProps {
  humidorCigar: CigarDisplay
  cigar: Cigar;
  viewMode: 'grid' | 'list';
  onEdit: (cigar: CigarDisplay) => void;
  onDelete: (cigar: CigarDisplay) => void;
  onView: (cigar: CigarDisplay) => void;
  onReview: (cigar: CigarDisplay) => void;
}

export function CigarCard({ humidorCigar, cigar, viewMode, onEdit, onDelete, onView, onReview }: CigarCardProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
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
    if (window.confirm('Are you sure you want to remove this cigar from your humidor?')) {
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
    <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-lg z-10 border border-white/10 overflow-hidden">
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

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-lg border border-white/10 p-4 hover:border-[#EFA427] transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-center gap-6">
          {/* Image Section */}
          <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
            {cigar.imageUrl ? (
              <img 
                src={humidorCigar.imageUrl} 
                alt={humidorCigar.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-black/40 to-black/20">
                No Image
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{humidorCigar.name}</h3>
                <p className="text-[#EFA427] font-medium">{humidorCigar.brand}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm bg-black/30 px-3 py-1 rounded-full">
                  Qty: {humidorCigar.quantity}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>{cigar.length}" × {cigar.ringGauge}</span>
              <span>•</span>
              <span>{cigar.strength}</span>
              <span>•</span>
              <span>{cigar.country}</span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleReviewClick}
              className="px-4 py-2 bg-[#EFA427] text-black font-medium rounded-lg hover:bg-[#EFA427]/90 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Review
            </button>
            
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showDropdown && <DropdownMenu />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#EFA427] transition-all duration-300 shadow-lg group"
    >
      {/* Image Section */}
      <div className="h-48 bg-black/40">
        {cigar.imageUrl ? (
          <img 
            src={humidorCigar.imageUrl} 
            alt={humidorCigar.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-black/40 to-black/20">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-lg">{humidorCigar.name}</h3>
            <p className="text-[#EFA427] font-medium">{humidorCigar.brand}</p>
          </div>
          
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && <DropdownMenu />}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/20 rounded-lg p-2">
            <span className="text-gray-400 text-sm">Size</span>
            <p className="text-white font-medium">{cigar.length}" × {cigar.ringGauge}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <span className="text-gray-400 text-sm">Strength</span>
            <p className="text-white font-medium">{cigar.strength}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <span className="text-gray-400 text-sm">Origin</span>
            <p className="text-white font-medium">{cigar.country}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <span className="text-gray-400 text-sm">Quantity</span>
            <p className="text-white font-medium">{humidorCigar.quantity}</p>
          </div>
        </div>

        {/* Price & Notes */}
        {(humidorCigar.purchasePrice || humidorCigar.notes) && (
          <div className="mb-4 space-y-2">
            {humidorCigar.purchasePrice && (
              <div className="text-[#EFA427] font-medium">
                ${humidorCigar.purchasePrice.toFixed(2)}
              </div>
            )}
            {humidorCigar.notes && (
              <p className="text-gray-400 text-sm line-clamp-2">{humidorCigar.notes}</p>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleReviewClick}
          className="w-full bg-[#EFA427] text-black font-medium py-2.5 px-4 rounded-lg hover:bg-[#EFA427]/90 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Write Review
        </button>
      </div>
    </div>
  );
}