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

interface CommentThreadProps {
  comment: Comment;
  postId: number;
  level?: number;
}

export const CommentThread = ({
  comment,
  postId,
  level = 0,
}: CommentThreadProps) => {
  console.log(`Comment ${comment.id} replies:`, comment.replies);
  const { user } = useUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { deleteComment } = useFeedOperations();
  const maxLevel = 3;

  const handleDelete = async () => {
    try {
      await deleteComment({ postId: postId, commentId: comment.id });
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleReport = () => {
    toast.success("Comment reported successfully");
  };

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
              onSuccess={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {comment.replies &&
          comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
            />
          ))}
      </div>
    </div>
  );
};
