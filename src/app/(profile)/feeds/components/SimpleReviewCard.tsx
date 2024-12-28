import React from "react";
import Image from "next/image";
import { ReviewResponse } from "@/hooks/useReviewOperations";

interface SimpleReviewCardProps {
  review: ReviewResponse;
}

export const SimpleReviewCard = ({ review }: SimpleReviewCardProps) => {
  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(score)) {
        stars.push(
          <span key={i} className="text-[#EFA427]">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-400">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] border border-white/10 rounded-lg hover:border-[#EFA427] transition-all duration-300">
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="font-medium text-white text-base mb-0.5 line-clamp-1">
              {review.cigar.name}
            </h3>
            <p className="text-[#E25931] text-sm">{review.cigar.brand}</p>
          </div>
          <span className="text-[#B9B9B9] text-xs">
            {formatDate(review.date)}
          </span>
        </div>

        {/* Score Section */}
        <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1.5 mb-2">
          <span className="text-[#B9B9B9] text-sm">Overall Score</span>
          <div className="flex items-center gap-2">
            <div className="text-sm">{renderStars(review.overallScore)}</div>
            <span className="text-[#EFA427] font-medium">
              {review.overallScore.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Notes Preview */}
        {review.notes && (
          <p className="text-[#B9B9B9] text-xs italic line-clamp-2">
            "{review.notes}"
          </p>
        )}
      </div>
    </div>
  );
};
