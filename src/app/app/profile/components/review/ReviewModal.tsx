import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageStep } from "./ImageStep";
import { PairingStep } from "./PairingStep";
import { TimerStep } from "./TimerStep";
import { ReviewForm } from "./ReviewForm";
import { useReviewOperations } from "@/hooks/useReviewOperations";
import { CigarAssistant } from "./CigarAssistant";
import { useImageUpload } from "@/hooks/useImageUploadOperations";
import { useFeedOperations } from "@/hooks/useFeedOperations";
import { Button } from "@/components/ui/button";

interface ReviewResponse {
  data: {
    id: number;
    [key: string]: any; // for other properties if they exist
  };
}

interface ReviewModalProps {
  humidorCigarId: number;
  isHumidorCigar: boolean;
  cigar: {
    id: number;
    name: string;
    brand: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reviewData: any) => void;
}

const ReviewModal = ({
  humidorCigarId,
  isHumidorCigar,
  cigar,
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  const router = useRouter();
  const { createReview, isCreating } = useReviewOperations();
  const { createPost, isCreating: isCreatingPost } = useFeedOperations();
  const { directUpload } = useImageUpload();

  // Step visibility states
  const [showImagePrompt, setShowImagePrompt] = useState(true);
  const [showPairingPrompt, setShowPairingPrompt] = useState(false);
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPostPrompt, setShowPostPrompt] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false)

  // Post creation states
  const [postContent, setPostContent] = useState("");
  const [submittedReviewId, setSubmittedReviewId] = useState<number | null>(
    null
  );

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Pairing states
  const [pairings, setPairings] = useState<
    Array<{ name: string; type: string }>
  >([]);

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [manualDuration, setManualDuration] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Review form states
  const [cigarStrength, setCigarStrength] = useState("MILD");
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    overall: false,
    flavor: false,
  });

  const [scores, setScores] = useState({
    constructionScore: 0,
    drawScore: 0,
    flavorScore: 0,
    burnScore: 0,
    impressionScore: 0,
  });

  const [flavorProfiles, setFlavorProfiles] = useState({
    FirstThird: [] as string[],
    SecondThird: [] as string[],
    FinalThird: [] as string[],
  });

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [isNotesMinimized, setIsNotesMinimized] = useState(false);
  const [notes, setNotes] = useState("");
  const [buyAgain, setBuyAgain] = useState<boolean | null>(null);
  const [decreaseHumidorCigar, setDecreaseHumidorCigar] = useState<
    boolean | null
  >(true);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isTimerRunning]);

  const moveToNextStep = () => {
    if (showImagePrompt) {
      setShowImagePrompt(false);
      setShowPairingPrompt(true);
    } else if (showPairingPrompt) {
      setShowPairingPrompt(false);
      setShowTimerPrompt(true);
    } else if (showTimerPrompt) {
      setShowTimerPrompt(false);
      setShowReviewForm(true);
      if (isTimerRunning) {
        setIsTimerRunning(true);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileUrl = URL.createObjectURL(file);
        setImageFile(file);
        setPreviewUrl(fileUrl);
        moveToNextStep();
      } catch (error) {
        toast.error("Failed to process image");
        console.error("Image upload error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmittingReview(true)
    try {
      let imageUrls: string[] = [];

      if (imageFile) {
        const response = await directUpload({
          file: imageFile,
          generateVariants: true,
          folder: "reviews",
        });
        imageUrls = [response.data.original];
      }

      const convertedScores = Object.entries(scores).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: Math.round(value * 10),
        }),
        {}
      );

      const isDecreasingHumidorCigar = decreaseHumidorCigar && isHumidorCigar
        ? humidorCigarId
        : null;

      const reviewData = {
        humidorCigarId: isDecreasingHumidorCigar,
        cigarId: cigar.id,
        duration: isTimerRunning ? Math.ceil(elapsedTime / 60) : manualDuration,
        strength: cigarStrength,
        ...convertedScores,
        ...flavorProfiles,
        notes,
        buyAgain: buyAgain === null ? undefined : buyAgain,
        pairings,
        images: imageUrls,
      };

      const response = await createReview(reviewData);
      // First cast to unknown, then to the expected type
      if (!response.data || typeof response.data !== 'object' || !('id' in response.data)) {
        throw new Error('Review ID not found in response');
      }
      setSubmittedReviewId(Number((response.data as unknown as { id: string }).id));
      toast.success("Review submitted successfully!");
      onSubmit?.(reviewData);

      // Show post creation prompt instead of closing
      setShowPostPrompt(true);
      setSubmittingReview(false)
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Review submission error:", error);
    }
  };

  const handlePost = async () => {
    try {
      if (!submittedReviewId) {
        throw new Error("Review ID not found");
      }

      await createPost({
        content: postContent,
        reviewId: submittedReviewId,
      });

      toast.success("Post created successfully!");
      onClose();
      router.push("/app/feeds");
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Post creation error:", error);
    }
  };

  const handleSkipPost = () => {
    onClose();
    router.push("/app/profile?tab=reviews");
  };

  const renderPostPrompt = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Share Your Review</h3>
      <p className="text-[#B9B9B9]">
        Would you like to share your review with the community?
      </p>
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Add a comment about your experience..."
        className="w-full h-32 bg-[#363636] rounded-xl p-3 text-white 
            placeholder:text-[#B9B9B9] focus:outline-none focus:ring-1 
            focus:ring-white/10 border border-white/5 resize-none"
      />
      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleSkipPost}
          variant="outline"
          className="bg-transparent text-white border-white/10 hover:bg-white/5"
        >
          Skip
        </Button>
        <Button
          onClick={handlePost}
          disabled={isCreatingPost}
          className="bg-[#EFA427] text-white hover:bg-[#EFA427]/90"
        >
          {isCreatingPost ? "Posting..." : "Share Review"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto border border-white/10">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Review: {cigar.name}
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">{cigar.brand}</p>
        </DialogHeader>

        { !showPostPrompt && <CigarAssistant cigar={cigar} showReviewForm={showReviewForm} />}

        {showImagePrompt && (
          <ImageStep
            onImageUpload={handleImageUpload}
            onSkip={moveToNextStep}
          />
        )}

        {showPairingPrompt && (
          <PairingStep
            pairings={pairings}
            onAddPairing={() =>
              setPairings([...pairings, { name: "", type: "Beverage" }])
            }
            onRemovePairing={(index) =>
              setPairings(pairings.filter((_, i) => i !== index))
            }
            onUpdatePairing={(index, field, value) => {
              const newPairings = [...pairings];
              newPairings[index] = { ...newPairings[index], [field]: value };
              setPairings(newPairings);
            }}
            onContinue={moveToNextStep}
            onSkip={() => {
              setPairings([]);
              moveToNextStep();
            }}
          />
        )}

        {showTimerPrompt && (
          <TimerStep
            onStartTimer={() => {
              setIsTimerRunning(true);
              moveToNextStep();
            }}
            onSkip={() => {
              setIsTimerRunning(false);
              moveToNextStep();
            }}
          />
        )}

        {showReviewForm && !showPostPrompt && (
          <ReviewForm
            scores={scores}
            flavorProfiles={{
              FirstThird: flavorProfiles.FirstThird,
              SecondThird: flavorProfiles.SecondThird,
              FinalThird: flavorProfiles.FinalThird,
            }}
            isTimerRunning={isTimerRunning}
            elapsedTime={elapsedTime}
            manualDuration={manualDuration}
            buyAgain={buyAgain}
            isHumidorCigar={isHumidorCigar}
            decreaseHumidorCigar={decreaseHumidorCigar}
            notes={notes}
            cigarStrength={cigarStrength}
            showNotesModal={showNotesModal}
            isNotesMinimized={isNotesMinimized}
            sectionsCollapsed={sectionsCollapsed}
            onScoreChange={(key, value) =>
              setScores((prev) => ({ ...prev, [key]: value }))
            }
            onFlavorProfileChange={(
              third: "FirstThird" | "SecondThird" | "FinalThird",
              flavors: string[]
            ) => setFlavorProfiles((prev) => ({ ...prev, [third]: flavors }))}
            onCigarStrengthChange={setCigarStrength}
            onManualDurationChange={setManualDuration}
            onBuyAgainChange={setBuyAgain}
            onDecreaseHumidorCigarChange={setDecreaseHumidorCigar}
            onNotesChange={setNotes}
            onNotesModalToggle={setShowNotesModal}
            onNotesMinimize={() => setIsNotesMinimized(true)}
            onSectionToggle={(section) =>
              setSectionsCollapsed((prev) => ({
                ...prev,
                [section]: !prev[section],
              }))
            }
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            isSubmittingReview={submittingReview}
          />
        )}

{showPostPrompt && renderPostPrompt()}

      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
