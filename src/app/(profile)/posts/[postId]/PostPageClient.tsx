'use client'

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useFeedOperations } from '@/hooks/useFeedOperations';
import { PostCard } from '../../feeds/components/PostCard';
import { CreatePostCard } from '../../feeds/components/CreatePostCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PostPageClientProps {
  postId: string;
}

const PostPageClient = ({ postId }: PostPageClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { getPost, addComment } = useFeedOperations();

  // Post Query
  const {
    data: postResponse,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('No post ID provided');
      const response = await getPost(Number(postId));
      return response;
    },
    enabled: !!postId,
  });

  if (isPostLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
      </div>
    );
  }

  if (postError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-500 text-center mb-2">Failed to load post</div>
        <button 
          onClick={() => router.back()}
          className="text-[#EFA427] hover:text-[#EFA427]/80 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!postResponse?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-white text-center mb-2">Post not found</div>
        <button 
          onClick={() => router.back()}
          className="text-[#EFA427] hover:text-[#EFA427]/80 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Back Button and Post Content */}
        <div className="md:col-span-8">
          {/* Back Button */}
          <Link 
            href="/feeds" 
            className="flex items-center gap-2 text-[#EFA427] hover:text-[#EFA427]/80 
              transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Feed
          </Link>

          {/* Post and Comments */}
          <div className="space-y-6">
            <PostCard post={postResponse.data} isDetailView={true} />
          </div>
        </div>

        {/* Right Column - Create Post and Coming Soon */}
        <div className="md:col-span-4 space-y-6">
          {user && <CreatePostCard />}
          
          {/* Coming Soon Card */}
          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl 
            border border-white/5 p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Coming Soon
            </h3>
            <p className="text-[#B9B9B9]">
              More exciting features are on the way! Stay tuned for updates.
            </p>
            
            {/* Coming Soon Features List */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[#B9B9B9]">
                <div className="w-2 h-2 rounded-full bg-[#EFA427]" />
                <span>Advanced Cigar Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-[#B9B9B9]">
                <div className="w-2 h-2 rounded-full bg-[#EFA427]" />
                <span>Cigar Collection Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-[#B9B9B9]">
                <div className="w-2 h-2 rounded-full bg-[#EFA427]" />
                <span>Community Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPageClient;