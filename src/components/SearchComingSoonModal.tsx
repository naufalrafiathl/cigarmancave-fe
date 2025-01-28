// src/components/SearchComingSoonModal.tsx
'use client';

import { X, Search } from 'lucide-react';

interface SearchComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchComingSoonModal({ isOpen, onClose }: SearchComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md rounded-lg bg-[#1E1E1E] shadow-xl relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#222222]">
            <h2 className="text-xl font-semibold text-[#EFA427]">
              Advanced Search Coming Soon
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-[#222222] rounded-full transition-colors text-[#B9B9B9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="bg-[#222222] p-4 rounded-full">
                <Search className="w-8 h-8 text-[#EFA427]" />
              </div>
              <p className="text-[#B9B9B9] text-center">
                We're upgrading our search capabilities to help you find exactly what you're looking for - whether it's friends, specific cigars, or brands. No more endless scrolling.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#EFA427] text-black rounded-lg hover:bg-[#EFA427]/90 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}