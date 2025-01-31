"use client";
import React, { useState, useEffect } from "react";
import { ReviewCard } from "../../profile/components/review/ReviewCard";
import {
  Heart,
  MessageCircle,
  Share2,
  UserCircle,
  BadgeCheck
} from "lucide-react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { PostCardSkeleton } from "./PostCardSkeleton";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import ReviewDetailModal from "../../profile/components/review/ReviewDetailModal";
import { useFeedOperations } from "@/hooks/useFeedOperations";
import { formatReviewData } from "@/utils/formatReviewData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentForm } from "../../posts/[postId]/components/CommentForm";
import { CommentThread } from "../../posts/[postId]/components/CommentThread";
import { useRouter } from "next/navigation";
import { Comment } from "@/types/feeds";
import { Post } from "@/types/feed";
import ImageCarousel from "./ImageCarousel";

interface PostCardProps {
  post: Post;
  isDetailView: boolean;
  onCommentSuccess?: () => void;
  user: any | null; // Add this
  isUserLoading?: boolean; // Add this
}

const buildCommentTree = (comments: Comment[]) => {
  const commentMap = new Map();
  const topLevel: Comment[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (comment.parentId === null || !commentMap.has(comment.parentId)) {
      topLevel.push(commentWithReplies);
    } else {
      const parent = commentMap.get(comment.parentId);
      parent.replies.push(commentWithReplies);
    }
  });

  return topLevel;
};

export const PostCard = ({
  post,
  isDetailView = false,
  onCommentSuccess,
  user,
  isUserLoading = false,
}: PostCardProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(() => {
    if (user && post.likes) {
      return post.likes.some((like) => like.user.id === user.id);
    }
    return false;
  });

  const getCounts = () => {
    if (isDetailView && post._count) {
      return {
        likes: post._count.likes,
        comments: post._count.comments,
      };
    }
    return {
      likes: post.engagement?.totalLikes ?? 0,
      comments: post.engagement?.totalComments ?? 0,
    };
  };

  const [likesCount, setLikesCount] = useState(getCounts().likes);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const { toggleLike, deletePost, reportPost } = useFeedOperations();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const formattedReview = formatReviewData(post.review);

  const topLevelComments = buildCommentTree(post.comments);
  const displayComments = topLevelComments.slice(0, 2);
  const hasMoreComments = post.comments.length > 2;

  useEffect(() => {
    if (user && post.likes) {
      const userLiked = post.likes.some((like) => like.user.id === user.id);
      setIsLiked(userLiked);
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    if (isLikeProcessing) return;

    try {
      setIsLikeProcessing(true);

      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      await toggleLike({ postId: post.id, isLiked });
    } catch (error) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error("Failed to update like status");
    } finally {
      setIsLikeProcessing(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/app/posts/${post.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleReport = async () => {
    await reportPost(post.id, "inappropriate content");
  };

  const handleViewAllComments = () => {
    if (!isDetailView) {
      router.push(`/posts/${post.id}`);
    } else {
      setShowAllComments(true);
    }
  };

  if (isUserLoading) {
    return <PostCardSkeleton />;
  }

  return (
    <div
      className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl border border-white/5 
      hover:border-white/10 transition-all duration-300 mx-0 md:mx-0"
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {post.user.profileImageUrl ? (
              <div className="relative w-12 h-12">
                <Image
                  src={post.user.profileImageUrl || "/placeholder-avatar.png"}
                  alt={post.user.fullName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <UserCircle />
            )}
            <div>
              <h3 className="flex items-baseline gap-1">
                <span
                  className={
                    post.user.isPremium
                      ? `font-medium text-[#EFA427]`
                      : `font-medium text-white`
                  }
                >
                  {post.user.fullName}
                </span>
                {post.user.isPremium && (
                  <BadgeCheck className="w-3.5 h-3.5 text-[#EFA427] translate-y-[1px]" />
                )}
              </h3>
              <p className="text-sm text-[#B9B9B9]">
                {format(new Date(post.createdAt), "MMM d, yyyy • h:mm a")}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-[#B9B9B9]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#2A2A2A] border-white/10"
            >
              {post.user.id === user?.id ? (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete post
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-white" onClick={handleReport}>
                  Report post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {post.content && <div className="text-[#E5E5E5]">{post.content}</div>}

        {post.images && post.images.length > 0 && (
          <ImageCarousel images={post.images} />
        )}

        {formattedReview && (
          <div onClick={() => setShowReviewModal(true)}>
            <ReviewCard
              review={formattedReview}
              viewMode="list"
              onView={() => setShowReviewModal(true)}
            />
          </div>
        )}

        <div className="flex items-center gap-6 pt-2 border-t border-white/10">
          <button
            onClick={handleLike}
            disabled={isLikeProcessing}
            className={`flex items-center gap-2 transition-colors duration-300
        ${isLiked ? "text-[#EFA427]" : "text-[#B9B9B9] hover:text-[#EFA427]"}
        ${isLikeProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
              fill={isLiked ? "#EFA427" : "none"}
            />
            <span>{likesCount}</span>
          </button>

          <Link
            href={`/app/posts/${post.id}`}
            className="flex items-center gap-2 text-[#B9B9B9] hover:text-white 
            transition-colors duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{getCounts().comments}</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-[#B9B9B9] hover:text-white 
              transition-colors duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {post.comments.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            {post.comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postId={post.id}
                isDetailView={isDetailView}
              />
            ))}

            {!isDetailView && post.engagement.hasMoreComments && (
              <Link
                href={`app/posts/${post.id}`}
                className="text-[#EFA427] text-sm hover:text-[#EFA427]/80 
              transition-colors duration-300"
              >
                View more comments
              </Link>
            )}
          </div>
        )}

        {/* Comment Form */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <CommentForm
            postId={post.id}
            onSuccess={onCommentSuccess}
            isDetailView={isDetailView}
          />
        </div>
      </div>

      {showReviewModal && formattedReview && (
        <ReviewDetailModal
          review={formattedReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};
