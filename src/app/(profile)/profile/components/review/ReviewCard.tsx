import {
  useReviewOperations,
  ReviewResponse,
} from "@/hooks/useReviewOperations";

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
      <span className="text-[#B9B9B9] text-sm">{label}</span>
      <div className="flex items-center">
        <div className="text-lg mr-2">{renderStars(score)}</div>
        <span className="text-white font-medium">{score.toFixed(1)}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] border-[#EFA427] rounded-xl hover:border-[#EFA427] hover:border transition-all duration-300 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    <div className="p-4 md:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-white text-lg md:text-xl mb-1 break-words">
              {review.cigar.name}
            </h3>
            <p className="text-[#E25931] font-medium">{review.cigar.brand}</p>
          </div>
          <div className="flex items-center text-[#B9B9B9] text-sm bg-black/20 px-3 py-1 rounded-full min-w-[80px] whitespace-nowrap">
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
            <span className="truncate">
              {formatDuration(review.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Stack on mobile, Two Columns on desktop */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6 flex-grow">
        {/* Scores Section */}
        <div className="w-full md:flex-1">
          <div className="bg-black/20 rounded-lg p-3 md:p-4">
            <span className="text-white font-semibold">Overall Score</span>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center flex-wrap">
                <div className="text-xl md:text-2xl mr-2 flex-shrink-0 w-[100px] flex justify-end">
                  {renderStars(review.overallScore)}
                </div>
                <span className="text-[#EFA427] text-xl font-bold ml-2">
                  {review.overallScore.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-t border-white/10 pt-3">
              <ScoreComponent
                label="Construction"
                score={review.constructionScore}
              />
              <ScoreComponent label="Draw" score={review.drawScore} />
              <ScoreComponent label="Flavor" score={review.flavorScore} />
              <ScoreComponent
                label="Impression"
                score={review.impressionScore}
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {review.notes && (
          <div className="w-full md:flex-1">
            <h4 className="text-white font-medium mb-2">Notes</h4>
            <p className="text-[#B9B9B9] text-sm italic break-words">
              "{review.notes || "No notes available"}"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
        <span className="text-[#B9B9B9] text-sm">
          {formatDate(review.date)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(review);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#2A2A2A] text-white hover:text-[#EFA427] border border-white/10 hover:border-[#EFA427] font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-sm"
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
