import React, { useState } from "react";
import { ReviewCard } from "../../profile/components/review/ReviewCard";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import ReviewDetailModal from "../../profile/components/review/ReviewDetailModal";
import { ReviewResponse } from "@/hooks/useReviewOperations";
import { useFeedOperations } from "@/hooks/useFeedOperations";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    reviewId?: number;
    user: {
      id: number;
      fullName: string;
      profileImageUrl: string;
    };
    review?: {
      id: number;
      createdAt: string;
      updatedAt: string;
      date: string;
      duration: number;
      price: number | null;
      strength: string;
      constructionScore: number;
      drawScore: number;
      flavorScore: number;
      burnScore: number;
      impressionScore: number;
      overallScore: number;
      notes: string;
      buyAgain: boolean;
      userId: number;
      cigarId: number;
      images: any[];
      cigar: {
        id: number;
        name: string;
        brand: {
          id: number;
          name: string;
        };
      };
      pairings: Array<{
        id: number;
        reviewId: number;
        pairingId: number;
        notes: string | null;
        pairing: {
          id: number;
          name: string;
          type: string;
        };
      }>;
    };
    comments: Array<{
      id: number;
      content: string;
      createdAt: string;
      user: {
        id: number;
        fullName: string;
        profileImageUrl: string;
      };
      replies: Array<{
        id: number;
        content: string;
        user: {
          id: number;
          fullName: string;
          profileImageUrl: string;
        };
      }>;
    }>;
    images: Array<{
      id: number;
      url: string;
    }>;
    likes: Array<{
      user: {
        id: number;
        fullName: string;
      };
    }>;
    engagement: {
      totalLikes: number;
      totalComments: number;
      totalEngagement: number;
      hasMoreComments: boolean;
    };
  };
}

interface ReviewWithFlavorScores {
    flavorPepperScore: number;
    flavorChocolateScore: number;
    flavorCreamyScore: number;
    flavorLeatherScore: number;
    flavorWoodyScore: number;
    flavorEarthyScore: number;
    flavorNuttyScore: number;
    flavorSweetScore: number;
    flavorFruityScore: number;
    flavorGrassyScore: number;
    flavorBerryScore: number;
    flavorCoffeeScore: number;
    flavorBittersScore: number;
  }

export const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.engagement.totalLikes);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { toggleLike } = useFeedOperations();

  const hasFlavorScores = (review: any): review is ReviewWithFlavorScores => {
    return (
      'flavorPepperScore' in review &&
      'flavorChocolateScore' in review &&
      'flavorCreamyScore' in review &&
      'flavorLeatherScore' in review &&
      'flavorWoodyScore' in review &&
      'flavorEarthyScore' in review &&
      'flavorNuttyScore' in review &&
      'flavorSweetScore' in review &&
      'flavorFruityScore' in review &&
      'flavorGrassyScore' in review &&
      'flavorBerryScore' in review &&
      'flavorCoffeeScore' in review &&
      'flavorBittersScore' in review
    );
  };
  
  const formattedReview: ReviewResponse | undefined = post.review
  ? {
      data: {},
      ...post.review,
      // Add all required flavor scores
      flavorPepperScore: hasFlavorScores(post.review) ? post.review.flavorPepperScore : 0,
      flavorChocolateScore: hasFlavorScores(post.review) ? post.review.flavorChocolateScore : 0,
      flavorCreamyScore: hasFlavorScores(post.review) ? post.review.flavorCreamyScore : 0,
      flavorLeatherScore: hasFlavorScores(post.review) ? post.review.flavorLeatherScore : 0,
      flavorWoodyScore: hasFlavorScores(post.review) ? post.review.flavorWoodyScore : 0,
      flavorEarthyScore: hasFlavorScores(post.review) ? post.review.flavorEarthyScore : 0,
      flavorNuttyScore: hasFlavorScores(post.review) ? post.review.flavorNuttyScore : 0,
      flavorSweetScore: hasFlavorScores(post.review) ? post.review.flavorSweetScore : 0,
      flavorFruityScore: hasFlavorScores(post.review) ? post.review.flavorFruityScore : 0,
      flavorGrassyScore: hasFlavorScores(post.review) ? post.review.flavorGrassyScore : 0,
      flavorBerryScore: hasFlavorScores(post.review) ? post.review.flavorBerryScore : 0,
      flavorCoffeeScore: hasFlavorScores(post.review) ? post.review.flavorCoffeeScore : 0,
      flavorBittersScore: hasFlavorScores(post.review) ? post.review.flavorBittersScore : 0,
      cigar: {
        id: post.review.cigar.id,
        name: post.review.cigar.name,
        brand: post.review.cigar.brand.name,
      },
      user: {
        id: post.user.id,
        fullName: post.user.fullName,
        profileImageUrl: post.user.profileImageUrl,
      },
    }
  : undefined;

  const handleLike = async () => {
    try {
      await toggleLike({ postId: post.id, isLiked });
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
<div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl border border-white/5 
  hover:border-white/10 transition-all duration-300 mx-0 md:mx-0">
      <div className="p-4 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src={post.user.profileImageUrl || "/placeholder-avatar.png"}
              alt={post.user.fullName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{post.user.fullName}</h3>
            <p className="text-sm text-[#B9B9B9]">
              {format(new Date(post.createdAt), "MMM d, yyyy • h:mm a")}
            </p>
          </div>
        </div>

        {/* Post Content */}
        {post.content && <div className="text-[#E5E5E5]">{post.content}</div>}

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.images.map((image) => (
              <div key={image.id} className="relative aspect-square">
                <Image
                  src={image.url}
                  alt="Post image"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Review Card */}
        {formattedReview && (
          <div onClick={() => setShowReviewModal(true)}>
            <ReviewCard
              review={formattedReview}
              viewMode="list"
              onView={() => setShowReviewModal(true)}
            />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center gap-6 pt-2 border-t border-white/10">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors duration-300
              ${
                isLiked
                  ? "text-[#EFA427]"
                  : "text-[#B9B9B9] hover:text-[#EFA427]"
              }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          <button
            className="flex items-center gap-2 text-[#B9B9B9] hover:text-white 
            transition-colors duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.engagement.totalComments}</span>
          </button>

          <button
            className="flex items-center gap-2 text-[#B9B9B9] hover:text-white 
            transition-colors duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={
                      comment.user.profileImageUrl || "/placeholder-avatar.png"
                    }
                    alt={comment.user.fullName}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-white">
                      {comment.user.fullName}
                    </span>{" "}
                    <span className="text-[#B9B9B9]">{comment.content}</span>
                  </p>
                  <div className="flex gap-4 mt-1 text-xs text-[#B9B9B9]">
                    <span>
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </span>
                    <button className="hover:text-white transition-colors duration-300">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {post.engagement.hasMoreComments && (
              <button
                className="text-[#EFA427] text-sm hover:text-[#EFA427]/80 
                transition-colors duration-300"
              >
                View more comments
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && formattedReview && (
        <ReviewDetailModal
          review={formattedReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};
