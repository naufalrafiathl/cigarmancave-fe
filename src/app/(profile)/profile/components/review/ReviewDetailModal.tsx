import { ReviewResponse } from "@/hooks/useReviewOperations";
import { useState } from "react";
import { ReviewFlavorDisplay } from "./ReviewFlavorDisplay";

interface ReviewDetailModalProps {
  review: ReviewResponse;
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  review,
  onClose,
}) => {
  const [isFlavorExpanded, setIsFlavorExpanded] = useState(false);
  const [isPairingsExpanded, setIsPairingsExpanded] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          {/* Header */}

          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {review.cigar.name}
              </h2>
              <p className="text-[#E25931] text-lg">{review.cigar.brand}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Basic Scores */}
              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-4">Scores</h3>
                <div className="space-y-2">
                  {/* Score rows with conditional colors */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Overall</span>
                    <span
                      className={`font-bold text-xl ${
                        review.overallScore / 10 < 2.5
                          ? "text-red-500"
                          : review.overallScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.overallScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Construction</span>
                    <span
                      className={`${
                        review.constructionScore / 10 < 2.5
                          ? "text-red-500"
                          : review.constructionScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.constructionScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Draw</span>
                    <span
                      className={`${
                        review.drawScore / 10 < 2.5
                          ? "text-red-500"
                          : review.drawScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.drawScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Flavor</span>
                    <span
                      className={`${
                        review.flavorScore / 10 < 2.5
                          ? "text-red-500"
                          : review.flavorScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.flavorScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Burn</span>
                    <span
                      className={`${
                        review.burnScore / 10 < 2.5
                          ? "text-red-500"
                          : review.burnScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.burnScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Impression</span>
                    <span
                      className={`${
                        review.impressionScore / 10 < 2.5
                          ? "text-red-500"
                          : review.impressionScore / 10 < 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {(review.impressionScore / 10).toFixed(1)}
                      <span className="text-sm text-white"> /5.0</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {/* Notes - Improved for better readability */}
              <div className="bg-black/20 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4 max-sm:mb-3">
                  Notes
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#B9B9B9] italic break-words whitespace-pre-wrap text-sm md:text-base">
                    "{review.notes || "No notes available"}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="">
              <div className="mb-6 bg-black/20 rounded-xl">
                <ReviewFlavorDisplay
                  FirstThird={review.FirstThird}
                  SecondThird={review.SecondThird}
                  FinalThird={review.FinalThird}
                  isCollapsed={!isFlavorExpanded}
                  onToggle={() => setIsFlavorExpanded(!isFlavorExpanded)}
                />
              </div>

              {/* Additional Info */}
              <div className="bg-black/20 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Duration</span>
                    <span className="text-white">
                      {review.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Buy Again</span>
                    <span className="text-white">
                      {review.buyAgain ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Review Date</span>
                    <span className="text-white">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pairings Section */}
              {review.pairings && review.pairings.length > 0 && (
                <div className="bg-black/20 mt-4 rounded-xl p-4">
                  <button
                    onClick={() => setIsPairingsExpanded(!isPairingsExpanded)}
                    className="w-full flex items-center justify-between text-white font-semibold mb-4"
                  >
                    <span>Pairings ({review.pairings.length})</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        isPairingsExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isPairingsExpanded && (
                    <div className="space-y-3">
                      {review.pairings.map((pairingItem) => (
                        <div
                          key={pairingItem.id}
                          className="bg-black/20 rounded-xl p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                              {pairingItem.pairing.name}
                            </span>
                            <span className="text-[#B9B9B9] text-sm px-2 py-1 bg-black/20 rounded-full">
                              {pairingItem.pairing.type}
                            </span>
                          </div>
                          {pairingItem.notes && (
                            <p className="text-[#B9B9B9] text-sm italic">
                              "{pairingItem.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
