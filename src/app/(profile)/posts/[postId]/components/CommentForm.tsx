import React, { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';
import { useFeedOperations } from '@/hooks/useFeedOperations';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export const CommentForm = ({ postId, parentId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useFeedOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        postId,
        content: content.trim(),
        parentId,
      });
      setContent('');
      onSuccess?.();
      toast.success(parentId ? 'Reply added successfully' : 'Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      {user?.picture && (
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src={user.picture}
            alt={user.name || 'User'}
            fill
            className="rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "Write a reply..." : "Write a comment..."}
          className="flex-1 bg-[#363636] rounded-full px-4 py-2 text-white placeholder:text-[#B9B9B9] 
            focus:outline-none focus:ring-1 focus:ring-white/10 border border-white/5"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className={`p-2 rounded-full transition-colors ${
            content.trim() && !isSubmitting
              ? 'bg-[#EFA427] text-white hover:bg-[#EFA427]/90'
              : 'bg-[#363636] text-[#B9B9B9] cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};