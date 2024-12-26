import { ReviewResponse } from "@/hooks/useReviewOperations";
import { FlavorScoreBar } from "./FlavorScoreBar";
import Image from "next/image";
import { useState } from "react";

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

  const flavorScores = [
    { name: "Pepper", score: review.flavorPepperScore },
    { name: "Chocolate", score: review.flavorChocolateScore },
    { name: "Creamy", score: review.flavorCreamyScore },
    { name: "Leather", score: review.flavorLeatherScore },
    { name: "Woody", score: review.flavorWoodyScore },
    { name: "Earthy", score: review.flavorEarthyScore },
    { name: "Nutty", score: review.flavorNuttyScore },
    { name: "Sweet", score: review.flavorSweetScore },
    { name: "Fruity", score: review.flavorFruityScore },
    { name: "Grassy", score: review.flavorGrassyScore },
    { name: "Berry", score: review.flavorBerryScore },
    { name: "Coffee", score: review.flavorCoffeeScore },
    { name: "Bitters", score: review.flavorBittersScore },
  ].filter(({ score }) => score > 0);

  const renderFlavorScore = (name: string, score: number) => {
    if (score > 0) {
      return (
        <div className="flex items-center justify-between py-2">
          <span className="text-[#B9B9B9]">{name}</span>
          <div className="flex items-center">
            <span className="text-[#EFA427] font-semibold">{score}</span>
          </div>
        </div>
      );
    }
    return null;
  };

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
              <div className="bg-black/20 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-4">Scores</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Overall</span>
                    <span className="text-[#EFA427] font-bold text-xl">
                      {review.overallScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Construction</span>
                    <span className="text-white">
                      {review.constructionScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Draw</span>
                    <span className="text-white">{review.drawScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Flavor</span>
                    <span className="text-white">{review.flavorScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Burn</span>
                    <span className="text-white">{review.burnScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9B9B9]">Impression</span>
                    <span className="text-white">{review.impressionScore}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-black/20 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-4">Notes</h3>
                <p className="text-[#B9B9B9] italic">
                  "{review.notes || "No notes available"}"
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="bg-black/20 rounded-lg p-4 mb-6">
                <button
                  onClick={() => setIsFlavorExpanded(!isFlavorExpanded)}
                  className="w-full flex items-center justify-between text-white font-semibold mb-4"
                >
                  <span>Flavor Profile ({flavorScores.length})</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      isFlavorExpanded ? "rotate-180" : ""
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
                {isFlavorExpanded && (
                  <div className="space-y-3">
                    {flavorScores.map(({ name, score }) => (
                      <div
                        key={name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[#B9B9B9]">{name}</span>
                        <div className="flex items-center gap-3">
                          <FlavorScoreBar score={score} />
                          <span className="text-[#EFA427] font-semibold w-4 text-right">
                            {score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-black/20 rounded-lg p-4">
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
                <div className="bg-black/20 mt-4 rounded-lg p-4">
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
                          className="bg-black/20 rounded-lg p-3"
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
