import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageStep } from './ImageStep';
import { PairingStep } from './PairingStep';
import { TimerStep } from './TimerStep';
import { ReviewForm } from './ReviewForm';

interface ReviewModalProps {
  cigar: {
    id: number;
    name: string;
    brand: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
}

const ReviewModal = ({ cigar, isOpen, onClose, onSubmit }: ReviewModalProps) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [showImagePrompt, setShowImagePrompt] = useState(true);
  const [showPairingPrompt, setShowPairingPrompt] = useState(false);
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Review data
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pairings, setPairings] = useState<Array<{ name: string; type: string }>>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [manualDuration, setManualDuration] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Section collapse state
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    overall: false,
    flavor: false
  });
  
  // Scoring state
  const [scores, setScores] = useState({
    constructionScore: 3,
    drawScore: 3,
    flavorScore: 3,
    burnScore: 3,
    impressionScore: 3,
  });
  
  const [flavorProfiles, setFlavorProfiles] = useState({
    flavorPepperScore: 0,
    flavorChocolateScore: 0,
    flavorCreamyScore: 0,
    flavorLeatherScore: 0,
    flavorWoodyScore: 0,
    flavorEarthyScore: 0,
    flavorNuttyScore: 0,
    flavorSweetScore: 0,
    flavorFruityScore: 0,
    flavorGrassyScore: 0,
    flavorBerryScore: 0,
    flavorCoffeeScore: 0,
    flavorBittersScore: 0,
  });

  // Notes management
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [isNotesMinimized, setIsNotesMinimized] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Buy again state
  const [buyAgain, setBuyAgain] = useState<boolean | null>(null);

  // Timer management
  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000); // Update every second
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
        moveToNextStep();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log(elapsedTime)
    console.log('is tmr', isTimerRunning)
    const reviewData = {
      cigarId: cigar.id,
      duration: isTimerRunning ? Math.ceil(elapsedTime / 60) : manualDuration,
      ...scores,
      ...flavorProfiles,
      notes,
      buyAgain,
      pairings,
      images: imageUrl ? [imageUrl] : [],
    };
    onSubmit(reviewData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto border border-white/10">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl font-semibold">Review: {cigar.name}</DialogTitle>
          <p className="text-sm text-gray-400 mt-1">{cigar.brand}</p>
        </DialogHeader>
        
        {showImagePrompt && (
          <ImageStep
            onImageUpload={handleImageUpload}
            onSkip={moveToNextStep}
          />
        )}
        
        {showPairingPrompt && (
          <PairingStep
            pairings={pairings}
            onAddPairing={() => setPairings([...pairings, { name: '', type: 'Beverage' }])}
            onRemovePairing={(index) => setPairings(pairings.filter((_, i) => i !== index))}
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
        
        {showReviewForm && (
          <ReviewForm
            scores={scores}
            flavorProfiles={flavorProfiles}
            isTimerRunning={isTimerRunning}
            elapsedTime={elapsedTime}
            manualDuration={manualDuration}
            buyAgain={buyAgain}
            notes={notes}
            showNotesModal={showNotesModal}
            isNotesMinimized={isNotesMinimized}
            sectionsCollapsed={sectionsCollapsed}
            onScoreChange={(key, value) => 
              setScores(prev => ({ ...prev, [key]: value }))
            }
            onFlavorProfileChange={(key, value) =>
              setFlavorProfiles(prev => ({ ...prev, [key]: value }))
            }
            onManualDurationChange={setManualDuration}
            onBuyAgainChange={setBuyAgain}
            onNotesChange={setNotes}
            onNotesModalToggle={setShowNotesModal}
            onNotesMinimize={() => setIsNotesMinimized(true)}
            onSectionToggle={(section) =>
              setSectionsCollapsed(prev => ({
                ...prev,
                [section]: !prev[section]
              }))
            }
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;