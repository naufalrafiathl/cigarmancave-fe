import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { Camera, X, Plus, Check } from "lucide-react";
import {
  ReviewResponse,
  useReviewOperations,
} from "@/hooks/useReviewOperations";
import { useQueryClient } from "@tanstack/react-query";
import { useFeedOperations } from "@/hooks/useFeedOperations";
import { SimpleReviewCard } from "./SimpleReviewCard";

interface CreatePostCardProps {
  onClose?: () => void;
}

export const CreatePostCard = ({ onClose }: CreatePostCardProps) => {
  const { user } = useUser();
  const { createPost, isCreating } = useFeedOperations();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );
  const [isSelectingReview, setIsSelectingReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const observer = useRef<IntersectionObserver>();
  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingReviews) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingReviews, hasMore]
  );

  const { getReviews, uploadImage } = useReviewOperations();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isSelectingReview) return;

      setIsLoadingReviews(true);
      try {
        const response = await getReviews({
          page,
          limit: ITEMS_PER_PAGE,
        });
        console.log("response", response);
        const reviewData = response.data.reviews || [];
        const pagination = response.data.pagination;

        setReviews((prevReviews) => {
          if (page === 1) return reviewData;
          return [...prevReviews, ...reviewData];
        });

        // Check if we're on the last page
        setHasMore(page < pagination.pages);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
        setHasMore(false);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [page, isSelectingReview]);

  useEffect(() => {
    if (isSelectingReview) {
      setPage(1);
      setReviews([]);
      setHasMore(true);
    }
  }, [isSelectingReview]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePost = async () => {
    if (!content.trim() && !images.length && !selectedReview) {
      alert("Please add some content, images, or select a review");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const url = await uploadImage(image);
          return url;
        })
      );

      await createPost({
        content,
        imageUrls: uploadedImageUrls,
        reviewId: selectedReview?.id,
      });

      setContent("");
      setImages([]);
      setImageUrls([]);
      setSelectedReview(null);

      onClose?.();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setImages([]);
    setImageUrls([]);
    setSelectedReview(null);
    onClose?.();
  };

  return (
    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl border border-white/5">
      <div className="p-4 space-y-4">
        {onClose && (
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-white">Create Post</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* User Input Area */}
        <div className="flex gap-3">
          {user?.picture && (
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={user.picture}
                alt={user.name || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-[#363636] rounded-lg p-3 text-white resize-none h-24 
              placeholder:text-[#B9B9B9] focus:outline-none focus:ring-1 focus:ring-white/10
              border border-white/5 transition-all duration-300"
          />
        </div>

        {/* Image Previews */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full
                    hover:bg-black/75 transition-colors duration-300"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Selected Review */}
        {selectedReview && (
          <div className="relative">
            <SimpleReviewCard review={selectedReview} />
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full
        hover:bg-black/75 transition-colors duration-300"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => document.getElementById("image-upload")?.click()}
              className="p-2 text-[#B9B9B9] hover:text-[#EFA427] rounded-full
                transition-colors duration-300"
              disabled={images.length >= 4}
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />

            <button
              onClick={() => setIsSelectingReview(true)}
              className="p-2 text-[#B9B9B9] hover:text-[#EFA427] rounded-full
                transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={
              isLoading ||
              (!content.trim() && !images.length && !selectedReview)
            }
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2
              transition-all duration-300
              ${
                isLoading
                  ? "bg-[#363636] text-[#B9B9B9] cursor-not-allowed"
                  : "bg-[#EFA427] text-white hover:bg-[#EFA427]/90"
              }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Posting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Review Selection Modal */}
      {isSelectingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl border border-white/10 
      p-4 max-w-xl w-full max-h-[80vh] overflow-y-auto m-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">
                Select Your Review
              </h3>
              <button
                onClick={() => setIsSelectingReview(false)}
                className="p-1.5 hover:bg-[#363636] rounded-full
            transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 && !isLoadingReviews ? (
                <div className="text-center py-8 text-[#B9B9B9]">
                  No reviews found. Create some reviews first!
                </div>
              ) : (
                <>
                  {reviews.map((review, index) => (
                    <div
                      key={review.id}
                      ref={
                        index === reviews.length - 1
                          ? lastReviewElementRef
                          : undefined
                      }
                      onClick={() => {
                        setSelectedReview(review);
                        setIsSelectingReview(false);
                      }}
                      className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                    >
                      <SimpleReviewCard review={review} />
                    </div>
                  ))}
                  {isLoadingReviews && (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin text-2xl">⏳</div>
                    </div>
                  )}

                  {!isLoadingReviews && !hasMore && reviews.length > 0 && (
                    <div className="text-center py-4 text-[#B9B9B9]">
                      No more reviews to load
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
