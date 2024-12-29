'use client'

import { useRouter,useSearchParams  } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { QueryKey, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useIntersection } from '@/hooks/useIntersection';
import { Post } from '@/types/feed';
import { useUser } from '@auth0/nextjs-auth0/client';
import { toast } from 'sonner';
import { useFeedOperations } from '@/hooks/useFeedOperations';
import { CommentForm } from './components/CommentForm';
import { CommentThread } from './components/CommentThread';
import { PostCard } from '../../feeds/components/PostCard';


const PostPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const { user } = useUser();
  const { getPost, getPostComments } = useFeedOperations();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const entry = useIntersection(loadMoreRef, {});

  const {
    data: post,
    isLoading: isPostLoading
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(Number(postId)) as Promise<{
      status: string;
      data: any;
    }>,
    enabled: !!postId,
  });
  

const {
  data: commentsData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isCommentsLoading,
} = useInfiniteQuery({
  queryKey: ['post-comments', postId] as const,
  queryFn: ({ pageParam }) => {
    return getPostComments(Number(postId), {
      page: pageParam,
      limit: 10,
    });
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: any) => {
    const { currentPage, pages } = lastPage.data.pagination;
    return currentPage < pages ? currentPage + 1 : undefined;
  },
  enabled: !!postId,
});

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/posts/${postId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Post link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  if (isPostLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-white">Post not found</div>
      </div>
    );
  }

  const allComments = commentsData?.pages?.flatMap((page: any) => page.data.comments) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
      {post && <PostCard post={post.data} isDetailView={true} />}
      </div>

      <div className="space-y-4">
        <CommentForm postId={Number(postId)} />
        
        {allComments.map((comment) => (
          <CommentThread key={comment.id} comment={comment} postId={Number(postId)} />
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        )}

        <div ref={loadMoreRef} className="h-10" />
      </div>
    </div>
  );
};

export default PostPageClient;