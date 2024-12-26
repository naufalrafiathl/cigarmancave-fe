"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ViewToggle } from "./humidor/ViewToggle";
import { PaginationControls } from "./humidor/PaginationControls";
import {
  useReviewOperations,
  ReviewResponse,
} from "@/hooks/useReviewOperations";
import { ReviewCard } from "./review/ReviewCard";
import ReviewDetailModal from "./review/ReviewDetailModal";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

export function ReviewsView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );
  const { getReviews } = useReviewOperations();

  // Use React Query to fetch reviews
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews", currentPage, ITEMS_PER_PAGE],
    queryFn: () => getReviews({ page: currentPage, limit: ITEMS_PER_PAGE }),
  });

  console.log("Query Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Filter and sort reviews
  const filteredAndSortedReviews = React.useMemo(() => {
    console.log("Filtering reviews from data:", data?.data?.reviews);
    const reviews = data?.data?.reviews ?? [];

    return reviews
      .filter((review) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          review.cigar.name.toLowerCase().includes(searchLower) ||
          review.cigar.brand.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.overallScore - a.overallScore;
          case "date":
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [data?.data?.reviews, searchQuery, sortBy]);

  const totalPages = data?.data?.pagination?.pages ?? 1;

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">My Reviews</h2>
              <p className="text-[#B9B9B9]">Track your cigar journey</p>
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-12 bg-[#2A2A2A] border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-white/10 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-white/10">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-white/60">Loading reviews...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <div className="text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to load reviews"}
            </div>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-[#2A2A2A] rounded-lg p-8 max-w-md w-full text-center">
              <div className="mb-4">
                {/* You can replace this with an actual illustration or icon */}
                <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto">
                  <PlusCircle className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start tracking your cigar experiences by adding your first
                review.
              </p>
              <Link
                href="?tab=humidor" // Adjust this path to your actual new review route
                className="inline-flex items-center justify-center px-4 py-2 bg-[#EFA427] hover:bg-amber-600 transition-colors rounded-md text-white font-medium"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Your First Review
              </Link>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
                : "flex flex-col gap-4"
            }
          >
            {filteredAndSortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                viewMode={viewMode}
                onView={(review) => {
                  console.log("test", review);
                  setSelectedReview(review);
                }}
              />
            ))}
          </div>
        )}

        {selectedReview && (
          <ReviewDetailModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        )}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* TODO: Add ReviewDetailModal component when a review is selected */}
    </div>
  );
}
