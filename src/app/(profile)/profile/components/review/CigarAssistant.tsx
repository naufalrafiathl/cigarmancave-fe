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

const CigarAssistant = ({ cigar, showReviewForm }: CigarAssistantProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [insights, setInsights] = useState<{
    history: string;
    blend: string;
    notes: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('apa?',showReviewForm);

  useEffect(() => {
    const fetchCigarInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prompt = `As a cigar expert, provide detailed information about the "${cigar.name}" in JSON format with three sections:
        1. history: Brief history of the brand and this specific cigar (2-3 sentences)
        2. blend: Details about the cigar's construction, wrapper, and origin (2-3 sentences)
        3. notes: Expected flavor profile and smoking experience (2-3 sentences)
        
        Focus on being accurate and concise. If this is a limited edition or special release, mention that context.`;

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

        let parsedInsights;
        try {
          parsedInsights =
            typeof data.insights === "string"
              ? JSON.parse(data.insights)
              : data.insights;
        } catch (e) {
          console.error("Failed to parse OpenAI response:", e);
          throw new Error("Invalid response format");
        }

        setInsights(parsedInsights);
      } catch (err) {
        console.error("Error fetching cigar insights:", err);
        setError("Unable to load cigar insights at this time");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCigarInsights();
  }, [cigar.name]);

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
              <span className="text-xs text-amber-500">Premium Feature</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
   showReviewForm &&  
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
            <span className="text-xs text-amber-500">Premium Feature</span>
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
