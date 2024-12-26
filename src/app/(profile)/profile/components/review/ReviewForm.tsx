import { TimerDisplay } from './TimerDisplay';
import { OverallRatings } from './OverallRatings';
import { FlavorProfile } from './FlavorProfile';
import { ManualDuration } from './ManualDuration';
import { BuyAgainSection } from './BuyAgainSection';
import { NotesSection } from './NotesSection';
import { Button } from '@/components/ui/button';
import { CigarStrengthSelection } from './CigarStrengthSelection';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  scores: Record<string, number>;
  flavorProfiles: Record<string, number>;
  isTimerRunning: boolean;
  elapsedTime: number;
  cigarStrength: string;
  manualDuration: number;
  buyAgain: boolean | null;
  notes: string;
  showNotesModal: boolean;
  isNotesMinimized: boolean;
  sectionsCollapsed: {
    overall: boolean;
    flavor: boolean;
  };
  isSubmitting?: boolean; // New prop
  onScoreChange: (key: string, value: number) => void;
  onFlavorProfileChange: (key: string, value: number) => void;
  onManualDurationChange: (value: number) => void;
  onBuyAgainChange: (value: boolean) => void;
  onNotesChange: (value: string) => void;
  onNotesModalToggle: (value: boolean) => void;
  onNotesMinimize: () => void;
  onCigarStrengthChange: (value: string) => void;
  onSectionToggle: (section: 'overall' | 'flavor') => void;
  onSubmit: () => void;
}

export const ReviewForm = ({
  scores,
  flavorProfiles,
  isTimerRunning,
  elapsedTime,
  manualDuration,
  buyAgain,
  notes,
  showNotesModal,
  isNotesMinimized,
  sectionsCollapsed,
  cigarStrength,
  isSubmitting = false, // Default to false
  onCigarStrengthChange,
  onScoreChange,
  onFlavorProfileChange,
  onManualDurationChange,
  onBuyAgainChange,
  onNotesChange,
  onNotesModalToggle,
  onNotesMinimize,
  onSectionToggle,
  onSubmit
}: ReviewFormProps) => (
  <div className="relative px-6 pb-20">
    {isTimerRunning && (
      <TimerDisplay time={elapsedTime} />
    )}

    <div className="space-y-6">
      <CigarStrengthSelection
        strength={cigarStrength}
        onChange={onCigarStrengthChange}
      />

      <OverallRatings
        scores={scores}
        isCollapsed={sectionsCollapsed.overall}
        onToggle={() => onSectionToggle('overall')}
        onScoreChange={onScoreChange}
      />

      <FlavorProfile
        profiles={flavorProfiles}
        isCollapsed={sectionsCollapsed.flavor}
        onToggle={() => onSectionToggle('flavor')}
        onProfileChange={onFlavorProfileChange}
      />

      {!isTimerRunning && (
        <ManualDuration
          duration={manualDuration}
          onChange={onManualDurationChange}
        />
      )}

      <BuyAgainSection
        value={buyAgain}
        onChange={onBuyAgainChange}
      />

      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={buyAgain === null || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </div>

    <NotesSection
      notes={notes}
      showModal={showNotesModal}
      isMinimized={isNotesMinimized}
      onNotesChange={onNotesChange}
      onToggleModal={onNotesModalToggle}
      onMinimize={onNotesMinimize}
    />
  </div>
);