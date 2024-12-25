import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';

interface OverallRatingsProps {
  scores: Record<string, number>;
  isCollapsed: boolean;
  onToggle: () => void;
  onScoreChange: (key: string, value: number) => void;
}

export const OverallRatings = ({
  scores,
  isCollapsed,
  onToggle,
  onScoreChange
}: OverallRatingsProps) => (
  <section className="border border-white/10 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-white/5"
    >
      <h3 className="text-lg font-semibold">Overall Ratings</h3>
      {isCollapsed ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      )}
    </button>
    
    {!isCollapsed && (
      <div className="p-4 border-t border-white/10 space-y-6">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm text-gray-400">
              {key.replace('Score', '')}
            </label>
            <div className="flex justify-between items-center">
              <StarRating
                value={value}
                onChange={(newValue) => onScoreChange(key, newValue)}
              />
              <span className="text-sm text-gray-400">{value}/5</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);