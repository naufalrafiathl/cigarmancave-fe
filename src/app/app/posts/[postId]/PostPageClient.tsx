"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useFeedOperations } from "@/hooks/useFeedOperations";
import { PostCard } from "../../feeds/components/PostCard";
import { CreatePostCard } from "../../feeds/components/CreatePostCard";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Post } from "@/types/feed";

interface PostPageClientProps {
  postId: string;
}

const PostPageClient = ({ postId }: PostPageClientProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { getPost } = useFeedOperations();

  const {
    data: postResponse,
    isLoading: isPostLoading,
    error: postError,
    refetch,
  } = useQuery<any, Error>({
    queryKey: ["post", postId, "detail"],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID provided");
      const response = await getPost(Number(postId), true);
      return response;
    },
    enabled: !!postId,
    staleTime: 0,
  });

  const handleCommentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["post", postId] });
    await queryClient.invalidateQueries({ queryKey: ["feed"] });
    await refetch();
  };

  if (isPostLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
      </div>
    );
  }

  if (postError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-12">
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
    <div className="max-w-7xl mx-auto px-0 md:px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Back Button and Post Content */}
        <div className="md:col-span-8">
          {/* Back Button */}
          <Link
            href="/app/feeds"
            className="ml-3 md:ml-0 flex items-center gap-2 text-[#EFA427] hover:text-[#EFA427]/80 
              transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Feed
          </Link>

          {/* Post and Comments */}
          <div className="space-y-6">
            <PostCard
              user={user}
              post={postResponse.data}
              isDetailView={true}
              onCommentSuccess={handleCommentSuccess}
            />
          </div>
        </div>

        <div className="hidden md:block md:col-span-4 space-y-6">
          {user && <CreatePostCard />}

          <Dialog
            open={showComingSoonModal}
            onOpenChange={setShowComingSoonModal}
          >
            <DialogContent className="bg-[#1A1A1A] border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-white mb-4">
                  Building Together.
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 text-[#B9B9B9]">
                {/* Introduction */}
                <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                  <p className="leading-relaxed">
                    We are building Cigar Mancave with passion and dedication.
                    We're not perfect, but with your help, we can build that
                    'one' cigar app we all needed. Your feedback matters to us -
                    please reach out at{" "}
                    <a
                      href="mailto:dev@cigarmancave.com"
                      className="text-[#EFA427] hover:underline"
                    >
                      dev@cigarmancave.com
                    </a>
                  </p>
                </div>

                {/* Coming Soon Features */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Small Changes Coming Soon
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Social Features
                      </h4>
                      <p>
                        Connect with fellow cigar enthusiasts - follow friends,
                        see their feeds, explore their profiles and humidors.
                        We're making it easier to build your own cigar
                        community.
                      </p>
                    </div>

                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Wishlist Integration
                      </h4>
                      <p>
                        See a cigar you love in your timeline? We'll help you
                        keep track. If it's not in your collection or wishlist
                        yet, you can add it with just one click.
                      </p>
                    </div>

                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Advanced Search
                      </h4>
                      <p>
                        We're upgrading our search capabilities to help you find
                        exactly what you're looking for - whether it's friends,
                        specific cigars, or brands. No more endless scrolling.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Major Updates */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    The Big Ones
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Smart Recommendation System
                      </h4>
                      <p>
                        We're developing an intelligent system that learns from
                        your reviews and likes to suggest cigars you might love.
                        Think of it as your personal cigar sommelier, helping
                        you discover your next favorite smoke.
                      </p>
                    </div>

                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Enhanced Cigar Import
                      </h4>
                      <p>
                        While we're proud of our current import feature, we're
                        taking it to the next level. We're working on
                        improvements to make the process faster and more
                        enjoyable, with higher upload limits for our dedicated
                        users.
                      </p>
                    </div>

                    <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[#EFA427] font-medium mb-2">
                        Learn With Us
                      </h4>
                      <div className="space-y-4">
                        <p>
                          We started exactly where many of you are - zero
                          knowledge about cigars, not knowing where to begin.
                          That's why we're building a comprehensive learning
                          platform within Cigar Mancave.
                        </p>

                        <div className="space-y-2 ml-2">
                          <div className="flex items-start gap-2">
                            <span className="text-[#EFA427] mt-1">•</span>
                            <span>
                              Interactive cigar basics guides for newcomers
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[#EFA427] mt-1">•</span>
                            <span>
                              Step-by-step cutting and lighting tutorials
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[#EFA427] mt-1">•</span>
                            <span>
                              Tasting note guides to develop your palate
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[#EFA427] mt-1">•</span>
                            <span>Advanced topics for experienced smokers</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[#EFA427] mt-1">•</span>
                            <span>Community-driven knowledge sharing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-sm text-white/60 pt-2 italic">
                  We're rolling these updates out in the coming weeks. Your
                  patience and feedback during this process helps us build
                  something truly special for our community. Thank you for being
                  part of this journey.
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div
            onClick={() => setShowComingSoonModal(true)}
            className="mt-6 bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl p-6 
    border border-white/5 cursor-pointer transition-all duration-300 
    hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E25931]/10
    group relative overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E25931]/5 to-transparent" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Roadmap Preview
                </h2>
                <span className="text-[#E25931] text-sm bg-[#E25931]/10 px-3 py-1 rounded-full border border-[#E25931]/20">
                  Coming Soon
                </span>
              </div>

              {/* Features list */}
              <div className="space-y-3">
                <div className="flex items-center text-[#B9B9B9] group-hover:translate-x-1 transition-transform">
                  <div
                    className="w-8 h-8 mr-3 rounded-lg bg-white/5 flex items-center justify-center
          group-hover:bg-[#E25931]/10 transition-colors"
                  >
                    🎯
                  </div>
                  <p className="group-hover:text-white transition-colors">
                    Smart Recommendations
                  </p>
                </div>

                <div className="flex items-center text-[#B9B9B9] group-hover:translate-x-1 transition-transform">
                  <div
                    className="w-8 h-8 mr-3 rounded-lg bg-white/5 flex items-center justify-center
          group-hover:bg-[#E25931]/10 transition-colors"
                  >
                    🤝
                  </div>
                  <p className="group-hover:text-white transition-colors">
                    Social Features
                  </p>
                </div>

                <div className="flex items-center text-[#B9B9B9] group-hover:translate-x-1 transition-transform">
                  <div
                    className="w-8 h-8 mr-3 rounded-lg bg-white/5 flex items-center justify-center
          group-hover:bg-[#E25931]/10 transition-colors"
                  >
                    🔍
                  </div>
                  <p className="group-hover:text-white transition-colors">
                    Advanced Search
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-[#B9B9B9] group-hover:text-[#E25931] transition-colors">
                  Click to learn more
                </span>
                <span className="text-[#E25931] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPageClient;
