import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { MoreVertical, Reply } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFeedOperations } from "@/hooks/useFeedOperations";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUserOperations";
import { CommentForm } from "./CommentForm";
import { Comment } from "@/types/feeds";
import { useQueryClient } from "@tanstack/react-query";

interface CommentThreadProps {
    comment: Comment;
    postId: number;
    level?: number;
    isDetailView?: boolean; // Add this prop
  }

  export const CommentThread = ({
    comment,
    postId,
    level = 0,
    isDetailView = false, // Default to false for feed view
  }: CommentThreadProps) => {
    const { user } = useUser();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { deleteComment } = useFeedOperations();
    const queryClient = useQueryClient();
    const maxLevel = isDetailView ? 5 : 3; // More levels allowed in detail view
  
    const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this comment?")) return;
  
      try {
        await deleteComment({ postId: postId, commentId: comment.id });
        
        // Invalidate both queries since this component is used in both views
        queryClient.invalidateQueries({ 
          queryKey: ['post', postId.toString()]
        });
        queryClient.invalidateQueries({ 
          queryKey: ['feed']
        });
  
        toast.success("Comment deleted successfully");
      } catch (error) {
        toast.error("Failed to delete comment");
      }
    };
  
    const handleReport = () => {
      toast.success("Comment reported successfully");
    };
  
    const handleReplySuccess = () => {
      setShowReplyForm(false);
      // Invalidate both queries
      queryClient.invalidateQueries({ 
        queryKey: ['post', postId.toString()]
      });
      queryClient.invalidateQueries({ 
        queryKey: ['feed']
      });
    };
  
    // Don't render if we've reached max depth
    if (level >= maxLevel) {
      return null;
    }
  
    return (
      <div className={`relative flex gap-3 ${level > 0 ? "ml-8 pt-4" : "pt-4"}`}>
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src={comment.user.profileImageUrl || "/placeholder-avatar.png"}
            alt={comment.user.fullName}
            fill
            className="rounded-full object-cover"
          />
        </div>
  
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-medium text-white">
                {comment.user.fullName}
              </span>
              <span className="text-sm text-[#B9B9B9] ml-2">
                {format(new Date(comment.createdAt), "MMM d, yyyy")}
              </span>
            </div>
  
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <MoreVertical className="w-4 h-4 text-[#B9B9B9]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#2A2A2A] border-white/10"
              >
                {user?.id === comment.user.id ? (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleReport}>
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  
          <p className="text-[#E5E5E5] mt-1">{comment.content}</p>
  
          {level < maxLevel && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 mt-2 text-sm text-[#B9B9B9] hover:text-white transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
          )}
  
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
              />
            </div>
          )}
  
          {comment.replies && comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
              isDetailView={isDetailView} // Pass down the prop
            />
          ))}
        </div>
      </div>
    );
  };