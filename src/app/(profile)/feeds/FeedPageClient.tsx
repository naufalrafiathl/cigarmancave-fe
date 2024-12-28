"use client";

import React, { useEffect, useRef, useState } from "react";
import { PostCard } from "./components/PostCard";
import { CreatePostCard } from "./components/CreatePostCard";
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
} from "@/components/ui/dialog";
import {
  useFeedOperations,
  FeedSortType,
  FeedFilterType,
} from "@/hooks/useFeedOperations";
import { useInfiniteQuery, InfiniteData, QueryFunctionContext } from "@tanstack/react-query";
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
  const [sortBy, setSortBy] = useState<FeedSortType>("recent");
  const [filterBy, setFilterBy] = useState<FeedFilterType>("all");
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const lastPostRef = useRef<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { getFeed } = useFeedOperations();
  const entry = useIntersection(loadMoreRef, {});
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<FeedPage, Error, InfiniteData<FeedPage>, QueryKey, number>({
    queryKey: ["feed", sortBy, filterBy] as const,
    queryFn: async ({ 
      pageParam,
      queryKey 
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

  const handleRefresh = async () => {
    setHasNewPosts(false);
    await refetch();
  };

  const allPosts = data?.pages.flatMap((page) => {
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
            <div className="mb-6 bg-[#1A1A1A] md:bg-[#1A1A1A]/95 md:backdrop-blur-sm pt-4 pb-4 px-4 md:px-0 -mx-4 md:mx-0">
              <div className="flex items-center justify-center gap-4">
                {isMobile ? (
                  <div className="flex gap-3 w-full mx-4 text-white">
                    <Select
                      value={sortBy}
                      onValueChange={(value: FeedSortType) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-full bg-[#2A2A2A] border-white/5">
                        {sortBy === "recent" && "Most Recent"}
                        {sortBy === "top" && "Most Popular"}
                        {sortBy === "hot" && "Trending"}
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-white/10">
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
                      <SelectTrigger className="w-full bg-[#2A2A2A] border-white/5">
                        {filterBy === "all" && "All Posts"}
                        {filterBy === "reviews" && "Reviews"}
                        {filterBy === "general" && "General"}
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-white/10 text-white">
                        <SelectItem value="all" className="text-white">
                          All Posts
                        </SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  // Desktop Filters - Centered
                  <div className="flex gap-4 text-white">
                    <Select
                      value={sortBy}
                      onValueChange={(value: FeedSortType) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-[140px] bg-[#2A2A2A] border-white/5 hover:border-white/10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-white/10">
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
                      <SelectTrigger className="w-[140px] bg-[#2A2A2A] border-white/5 hover:border-white/10">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-white/10 text-white">
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
                    <PostCard key={post.id} post={post} />
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

          <div className="hidden lg:block lg:w-[350px] space-y-6">
            <div className="sticky top-4">
              <CreatePostCard onClose={() => {}} />
              <div
                className="mt-6 bg-gradient-to-b from-[#2A2A2A] to-[#232323] 
                rounded-xl p-4 border border-white/5"
              >
                <h2 className="text-lg font-medium text-white mb-3">
                  Coming Soon
                </h2>
                <div className="space-y-2 text-[#B9B9B9]">
                  <p>• Weekly Featured Cigars</p>
                  <p>• Community Blog Posts</p>
                  <p>• Trading Opportunities</p>
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
          <DialogContent className="sm:max-w-[425px] p-0 bg-[#1A1A1A] border-white/10">
            <DialogTitle className="sr-only">Create New Post</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new post to share with your followers
            </DialogDescription>
            <CreatePostCard onClose={() => setShowCreatePostModal(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
