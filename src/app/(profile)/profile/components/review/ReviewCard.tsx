import { ReviewResponse } from "@/hooks/useReviewOperations";
import Image from "next/image";

interface ReviewCardProps {
  review: ReviewResponse;
  viewMode: "grid" | "list";
  onView: (review: ReviewResponse) => void;
}

export const ReviewCard = ({ review, viewMode, onView }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (score: number) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(score)) {
        stars.push(
          <span key={i} className="text-[#EFA427]">
            ★
          </span>
        );
      } else if (i === Math.floor(score) && score % 1 !== 0) {
        stars.push(
          <div key={i} className="relative inline-block">
            <span className="text-gray-400">★</span>
            <span
              className="absolute inset-0 text-[#EFA427] overflow-hidden"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              ★
            </span>
          </div>
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
    return `${minutes}m`;
  };
  const ScoreComponent = ({
    label,
    score,
  }: {
    label: string;
    score: number;
  }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-[#B9B9B9] text-sm whitespace-nowrap mr-2">
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <div className="text-sm md:text-base flex-shrink-0">
          {renderStars(score)}
        </div>
        <span className="text-white font-medium text-sm md:text-base whitespace-nowrap">
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );

  const hasImage = review.images && review.images.length > 0;

  const truncateNotes = (notes: string, maxLength: number = 100) => {
    if (!notes) return "";
    if (notes.length <= maxLength) return notes;
    return notes.slice(0, maxLength) + "...";
  };

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] border-[#EFA427] rounded-xl hover:border-[#EFA427] hover:border transition-all duration-300 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
      <div className="p-4 md:p-6 flex flex-col h-full">
      <div className="border-b border-white/10 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-lg md:text-xl mb-1 truncate">
                {review.cigar.name}
              </h3>
              <p className="text-[#E25931] font-medium truncate">
                {review.cigar.brand}
              </p>
            </div>
            <div className="flex items-center text-[#B9B9B9] text-sm bg-black/20 px-3 py-1 rounded-full shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDuration(review.duration)}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          {/* Scores Section */}
          <div className="w-full md:w-1/2">
            <div className="bg-black/20 rounded-xl p-3 md:p-4">
              {/* Overall Score */}
              <div className="mb-3">
                <span className="text-white font-semibold block mb-2">
                  Overall Score
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex text-lg md:text-xl">
                    {renderStars(review.overallScore)}
                  </div>
                  <span className="text-[#EFA427] text-lg md:text-xl font-bold">
                    {review.overallScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Individual Scores */}
              <div className="space-y-1 border-t border-white/10 pt-3">
                <div className="flex flex-col space-y-2">
                  <ScoreComponent
                    label="Construction"
                    score={review.constructionScore}
                  />
                  <ScoreComponent label="Draw" score={review.drawScore} />
                  <ScoreComponent label="Burn" score={review.burnScore} />
                  <ScoreComponent label="Flavor" score={review.flavorScore} />
                  <ScoreComponent
                    label="Impression"
                    score={review.impressionScore}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image and Truncated Notes OR Full Notes */}
          <div className="w-full md:w-1/2">
            {hasImage ? (
              // With Image Layout
              <div className="flex flex-col gap-3">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <Image
                    src={review.images[0].url}
                    alt={`Review image for ${review.cigar.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {review.notes && (
                  <div className="flex-1 bg-black/20 rounded-xl p-3">
                    <p className="text-[#B9B9B9] text-sm italic mb-2">
                      "{truncateNotes(review.notes)}"
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(review);
                      }}
                      className="text-[#EFA427] text-sm hover:underline flex items-center gap-1"
                    >
                      View details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Without Image Layout
              review.notes && (
                <div className="h-max bg-black/20 rounded-xl p-4 truncate">
                  <p className="text-[#EFA427] font-medium mb-2 truncate">Notes:</p>
                  <p className="italic text-[#B9B9B9] pl-2 truncate">"{review.notes}"</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(review);
                    }}
                    className="text-[#EFA427] text-sm hover:underline flex items-center gap-1 mt-3"
                  >
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-white/10">
          <span className="text-[#B9B9B9] text-sm">
            {formatDate(review.date)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(review);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-[#2A2A2A] text-white hover:text-[#EFA427] border border-white/10 hover:border-[#EFA427] font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
