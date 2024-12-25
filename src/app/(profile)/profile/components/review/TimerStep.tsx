import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerStepProps {
  onStartTimer: () => void;
  onSkip: () => void;
}

export const TimerStep = ({ onStartTimer, onSkip }: TimerStepProps) => (
  <div className="flex flex-col items-center gap-6 p-8">
    <Timer className="w-16 h-16 text-[#EFA427]" />
    <h2 className="text-2xl font-semibold text-center">
      Track Your Journey ⏱️
    </h2>
    <p className="text-center text-gray-400">
      Would you like to record your smoking time?
    </p>
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Button
        variant="default"
        onClick={onStartTimer}
        className="w-full"
      >
        Start Timer
      </Button>
      <Button
        variant="outline"
        onClick={onSkip}
        className="w-full"
      >
        Skip
      </Button>
    </div>
  </div>
);