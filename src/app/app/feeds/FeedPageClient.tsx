"use client";

import React, { useEffect, useRef, useState } from "react";
import { PostCard } from "./components/PostCard";
import { CreatePostCard } from "./components/CreatePostCard";
import { useUser } from "@/hooks/useUserOperations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  useFeedOperations,
  FeedSortType,
  FeedFilterType,
} from "@/hooks/useFeedOperations";
import {
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { useIntersection } from "@/hooks/useIntersection";
import { ArrowDownCircle, Loader2, Plus } from "lucide-react";
import { Post } from "@/types/feed";

interface FeedPagination {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

interface FeedPageData {
  posts: Post[];
  pagination: FeedPagination;
}

interface FeedPage {
  status: string;
  data: FeedPageData;
}

type QueryKey = ["feed", FeedSortType, FeedFilterType];

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

export default function FeedPageClient() {
  const { user, isLoading: isUserLoading } = useUser();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [sortBy, setSortBy] = useState<FeedSortType>("recent");
  const [filterBy, setFilterBy] = useState<FeedFilterType>("all");
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const lastPostRef = useRef<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  

  const { getFeed } = useFeedOperations();
  const entry = useIntersection(loadMoreRef, {});
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery<
    FeedPage,
    Error,
    InfiniteData<FeedPage>,
    QueryKey,
    number
  >({
    queryKey: ["feed", sortBy, filterBy] as const,
    queryFn: async ({
      pageParam,
      queryKey,
    }: QueryFunctionContext<QueryKey, number>) => {
      const response = await getFeed({
        page: pageParam,
        limit: 10,
        sortBy: queryKey[1],
        filterBy: queryKey[2],
      });
      return response as FeedPage;
    },
    getNextPageParam: (lastPage: FeedPage) => {
      const { currentPage, pages } = lastPage.data.pagination;
      return currentPage < pages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const currentNewestPost = data?.pages[0]?.data.posts[0];
    if (currentNewestPost) {
      lastPostRef.current = currentNewestPost.id;
    }

    const pollInterval = setInterval(async () => {
      if (!lastPostRef.current) return;

      try {
        const response = await getFeed({
          sortBy,
          filterBy,
          limit: 1,
        });

        const newestPostsResponse = response as FeedPage;
        const newestPost = newestPostsResponse.data.posts[0];

        if (newestPost && newestPost.id !== lastPostRef.current) {
          setHasNewPosts(true);
        }
      } catch (error) {
        console.error("Failed to check for new posts:", error);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [sortBy, filterBy, data]);

  console.log('inidata',data)

  const handleRefresh = async () => {
    setHasNewPosts(false);
    await refetch();
  };

  const allPosts =
    data?.pages.flatMap((page) => {
      if (!page?.data?.posts) return [];
      return page.data.posts.map((post: Post) => ({
        ...post,
        user: {
          ...post.user,
          fullName: post.user.fullName || "Unknown User",
        },
        content: post.content || "",
        createdAt: post.createdAt || new Date().toISOString(),
        images: post.images || [],
        engagement: {
          totalLikes: Number(post.engagement?.totalLikes || 0),
          totalComments: Number(post.engagement?.totalComments || 0),
          totalEngagement: Number(post.engagement?.totalEngagement || 0),
          hasMoreComments: Boolean(post.engagement?.hasMoreComments),
        },
      }));
    }) ?? [];

  return (
    <div className="min-h-screen bg-[#1A1A1A] rounded-xl">
      <div className="max-w-7xl mx-auto md:px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed Column */}
          <div className="flex-1">
            <div className="mb-6 bg-[#1A1A1A] md:bg-[#1A1A1A]/95 md:backdrop-blur-sm pt-4 pb-4 px-4 md:px-0  md:mx-0">
              <div className="flex items-center justify-center gap-4">
                {isMobile ? (
                  <div className="flex gap-3 w-full mx-4 text-black">
                    <Select
                      value={sortBy}
                      onValueChange={(value: FeedSortType) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-full bg-[#EFA427] border-white/5">
                        {sortBy === "recent" && "Most Recent"}
                        {sortBy === "top" && "Most Popular"}
                        {sortBy === "hot" && "Trending"}
                      </SelectTrigger>
                      <SelectContent className="bg-[#EFA427] border-white/10 text-black">
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="top">Most Popular</SelectItem>
                        <SelectItem value="hot">Trending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterBy}
                      onValueChange={(value: FeedFilterType) =>
                        setFilterBy(value)
                      }
                    >
                      <SelectTrigger className="w-full bg-[#EFA427] border-white/5">
                        {filterBy === "all" && "All Posts"}
                        {filterBy === "reviews" && "Reviews"}
                        {filterBy === "general" && "General"}
                      </SelectTrigger>
                      <SelectContent className="bg-[#EFA427] border-white/10 text-black">
                        <SelectItem value="all" className="text-black">
                          All Posts
                        </SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  // Desktop Filters - Centered
                  <div className="flex gap-4 text-black">
                    <Select
                      value={sortBy}
                      onValueChange={(value: FeedSortType) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-[140px] bg-[#EFA427] border-white/5 text-black hover:border-white/10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#EFA427] text-black border-white/10">
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="top">Most Popular</SelectItem>
                        <SelectItem value="hot">Trending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterBy}
                      onValueChange={(value: FeedFilterType) =>
                        setFilterBy(value)
                      }
                    >
                      <SelectTrigger className="w-[140px] bg-[#EFA427] border-white/5 hover:border-white/10">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#EFA427] border-white/10 text-black">
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="-mx-0 md:mx-0">
              {hasNewPosts && (
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gradient-to-b from-[#2A2A2A] to-[#232323] 
                    border border-white/5 hover:border-white/10
                    text-[#EFA427] py-3 rounded-xl mb-4 flex items-center justify-center gap-2 
                    transition-all duration-300"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  Show new posts
                </button>
              )}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
                </div>
              ) : allPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#B9B9B9]">No posts found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isDetailView={false}
                      user={user} // Pass user as prop
                      isUserLoading={isUserLoading} // Optionally pass loading state
                    />
                  ))}

                  <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center"
                  >
                    {isFetchingNextPage && (
                      <Loader2 className="w-6 h-6 text-[#EFA427] animate-spin" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

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

          <div className="hidden lg:block lg:w-[350px] space-y-6">
            <div className="sticky top-4">
              <CreatePostCard onClose={() => {}} />
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
      </div>

      {isMobile && (
        <button
          onClick={() => setShowCreatePostModal(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-[#EFA427] rounded-full 
          flex items-center justify-center shadow-lg hover:bg-[#EFA427]/90 
          transition-all duration-300 z-50"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}

      <div className="px-4">
        <Dialog
          open={showCreatePostModal && isMobile}
          onOpenChange={setShowCreatePostModal}
        >
          <DialogContent
            className="sm:max-w-[425px] p-0 bg-[#1A1A1A] border-white/10"
            // Add this to ensure higher z-index than the fixed button
            style={{ zIndex: 100 }}
          >
            <DialogTitle className="sr-only">Create New Post</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new post to share with your followers
            </DialogDescription>
            <CreatePostCard
              onClose={() => setShowCreatePostModal(false)}
              isMobile={true} // Add this prop
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
