// components/review/ReviewFlavorDisplay.tsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewFlavorDisplayProps {
  FirstThird: string[];
  SecondThird: string[];
  FinalThird: string[];
  isCollapsed: boolean;
  onToggle: () => void;
}

const THIRD_COLORS = {
  second: {
    text: '#EFA427', // Original golden yellow
    bg: 'rgba(239, 164, 39, 0.1)',
    border: 'rgba(239, 164, 39, 0.2)'
  },
  first: {
    text: '#FFB84D', // Lighter golden yellow
    bg: 'rgba(255, 184, 77, 0.1)',
    border: 'rgba(255, 184, 77, 0.2)'
  },
  final: {
    text: '#D4901F', // Darker golden yellow
    bg: 'rgba(212, 144, 31, 0.1)',
    border: 'rgba(212, 144, 31, 0.2)'
  }
};

export const ReviewFlavorDisplay = ({
  FirstThird,
  SecondThird,
  FinalThird,
  isCollapsed,
  onToggle,
}: ReviewFlavorDisplayProps) => {
  return (
    <section className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg text-white font-medium">Flavor Profile</h3>
          <span className="text-sm text-gray-400">
            {(FirstThird.length + SecondThird.length + FinalThird.length)}
          </span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          {/* First Third */}
          {FirstThird.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-white">
                First Third
              </h4>
              <div className="flex flex-wrap gap-2">
                {FirstThird.map((flavor) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 rounded-full text-sm border"
                    style={{
                      color: THIRD_COLORS.first.text,
                      backgroundColor: THIRD_COLORS.first.bg,
                      borderColor: THIRD_COLORS.first.border,
                    }}
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Second Third */}
          {SecondThird.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-white" >
                Second Third
              </h4>
              <div className="flex flex-wrap gap-2">
                {SecondThird.map((flavor) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 rounded-full text-sm border"
                    style={{
                      color: THIRD_COLORS.second.text,
                      backgroundColor: THIRD_COLORS.second.bg,
                      borderColor: THIRD_COLORS.second.border,
                    }}
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Final Third */}
          {FinalThird.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-white" >
                Final Third
              </h4>
              <div className="flex flex-wrap gap-2">
                {FinalThird.map((flavor) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 rounded-full text-sm border"
                    style={{
                      color: THIRD_COLORS.final.text,
                      backgroundColor: THIRD_COLORS.final.bg,
                      borderColor: THIRD_COLORS.final.border,
                    }}
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* If no flavors are selected */}
          {FirstThird.length === 0 && SecondThird.length === 0 && FinalThird.length === 0 && (
            <p className="text-sm text-gray-400 text-center italic">
              No flavors recorded
            </p>
          )}
        </div>
      )}
    </section>
  );
};