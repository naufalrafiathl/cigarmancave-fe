// StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  // Calculate percentage for the colored part (0-5 scale)
  const percentage = ((value - 1) / 4) * 100;

  return (
    <div className="flex items-center gap-4 w-full">
      <input
        type="range"
        min="1"
        max="5"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer
          bg-gradient-to-r from-[#EFA427] from-${percentage}% via-gray-700 via-${percentage}% to-gray-700
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#EFA427]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[#EFA427]
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-progress]:bg-[#EFA427]
          [&::-moz-range-track]:bg-gray-700`}
        style={{
          background: `linear-gradient(to right, #EFA427 0%, #EFA427 ${percentage}%, rgb(55 65 81) ${percentage}%, rgb(55 65 81) 100%)`
        }}
      />
      <div className="flex items-center gap-2 min-w-[8rem]">
        <span className="text-sm text-gray-400">
          {value.toFixed(1)}/5
        </span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(value)
                  ? 'fill-[#EFA427] text-[#EFA427]'
                  : index === Math.floor(value) && (value % 1) >= 0.5
                  ? 'fill-[#EFA427]/50 text-[#EFA427]'
                  : 'fill-none text-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarRating;