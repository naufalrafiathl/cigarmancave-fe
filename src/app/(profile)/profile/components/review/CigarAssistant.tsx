import React, { useState, useEffect } from "react";
import { Crown, Bot, Sparkles, ChevronUp, ChevronDown } from "lucide-react";

interface CigarAssistantProps {
  cigar: {
    id: number;
    name: string;
    brand: string;
  };
  showReviewForm: boolean;
}

interface CigarInsights {
  history: string;
  blend: string;
  notes: string;
}

const CigarAssistant = ({ cigar, showReviewForm }: CigarAssistantProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [insights, setInsights] = useState<CigarInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log('ini cigarnye', cigar)
  useEffect(() => {
    const fetchCigarInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prompt = `As a cigar expert, provide a JSON response about the "${cigar.name}" with exactly this format:
        {
          "history": "2-3 sentences about the brand and cigar history",
          "blend": "2-3 sentences about the cigar's construction, wrapper, and origin",
          "notes": "2-3 sentences about expected flavor profile and smoking experience"
        }
        
        Return ONLY the JSON object with string values - no nested objects or arrays.`;

        const response = await fetch("/api/openai/insights/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            cigarName: cigar.name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cigar insights");
        }

        const data = await response.json();
        const parsedInsights = typeof data.insights === "string"
          ? JSON.parse(data.insights)
          : data.insights;

        setInsights(parsedInsights);
      } catch (err) {
        console.error("Error fetching cigar insights:", err);
        setError("Unable to load cigar insights at this time");
      } finally {
        setIsLoading(false);
      }
    };

    if (showReviewForm) {
      fetchCigarInsights();
    }
  }, [cigar.name, showReviewForm]);

  if (!showReviewForm) return null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (error) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#2A2A2A] to-[#232323] rounded-lg border border-amber-500/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-500" />
              <h3 className="text-amber-500 font-medium">
                Mancave Assistant
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-500"></span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#2A2A2A] to-[#232323] rounded-lg border border-amber-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-500" />
            <h3 className="text-amber-500 font-medium">
              Mancave Assistant
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-amber-500"></span>
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