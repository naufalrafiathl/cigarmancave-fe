// components/review/StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const StarRating = ({ value, onChange, max = 5 }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index + 1)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${
              index < value
                ? 'fill-[#EFA427] text-[#EFA427]'
                : 'fill-none text-gray-400'
            } hover:text-[#EFA427] transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;