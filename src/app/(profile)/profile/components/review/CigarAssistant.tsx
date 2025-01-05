import React, { useState, useEffect, useCallback } from "react";
import { Crown, Bot, Sparkles, ChevronUp, ChevronDown, Lock } from "lucide-react";
import Link from "next/link";
import { useAssistOperations } from "@/hooks/useAssistantOperations";
import { toast } from "sonner";

interface CigarAssistantProps {
  cigar: {
    id: number;
    name: string;
    brand: string;
  };
  showReviewForm: boolean;
}

const CigarAssistant = ({ cigar, showReviewForm }: CigarAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false); // Start as false
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [insights, setInsights] = useState<{ history: string; blend: string; notes: string; } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { getInsights, isPremium } = useAssistOperations();

  // Only fetch insights if user is premium and component should be shown
  useEffect(() => {
    if (!isPremium || !showReviewForm || !cigar.id) {
      return;
    }

    let isSubscribed = true;

    const fetchInsights = async () => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const insightsData = await getInsights(cigar.id);
        if (isSubscribed) {
          setInsights(insightsData);
        }
      } catch (err) {
        if (!isSubscribed) return;
        
        const message = err instanceof Error ? err.message : "Failed to fetch insights";
        setError(message);
        
        if (!message.toLowerCase().includes('premium')) {
          toast.error("Failed to load cigar insights. Please try again later.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      isSubscribed = false;
    };
  }, [cigar.id, isPremium, showReviewForm, getInsights]);

  // Early return if not showing review form
  if (!showReviewForm) return null;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Premium gate component
  if (!isPremium) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#2A2A2A] to-[#232323] rounded-xl border border-amber-500/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-500" />
              <h3 className="text-amber-500 font-medium">
                Mancave Assistant
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-gray-300 mb-3">
              Unlock expert cigar insights with Mancave Premium
            </p>
            <Link
              href="/profile?tab=subscription"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-black rounded-xl 
                hover:bg-amber-400 transition-colors font-medium"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#2A2A2A] to-[#232323] rounded-xl border border-amber-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-500" />
            <h3 className="text-amber-500 font-medium">
              Mancave Assistant
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-white/5 rounded-full transition-colors ml-2"
            >
              {isCollapsed ? (
                <ChevronDown className="w-5 h-5 text-amber-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-amber-500" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCollapsed ? "h-0 opacity-0" : "opacity-100"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="ml-2 text-gray-400">
                Analyzing cigar profile...
              </span>
            </div>
          ) : error ? (
            <p className="text-red-400 text-center py-4">{error}</p>
          ) : insights ? (
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                <span className="text-amber-500 font-medium">History:</span>{" "}
                {insights.history}
              </p>
              <p className="text-gray-300">
                <span className="text-amber-500 font-medium">Blend:</span>{" "}
                {insights.blend}
              </p>
              <p className="text-gray-300">
                <span className="text-amber-500 font-medium">
                  What to expect:
                </span>{" "}
                {insights.notes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export { CigarAssistant };