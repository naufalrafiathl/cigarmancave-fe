import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from '@/components/ui/button';

const PAIRING_TYPES = [
  'Beverage',
  'Spirit',
  'Food',
  'Coffee/Tea',
  'Wine',
  'Beer',
  'Other'
] as const;

interface PairingStepProps {
  pairings: Array<{ name: string; type: string }>;
  onAddPairing: () => void;
  onRemovePairing: (index: number) => void;
  onUpdatePairing: (index: number, field: 'name' | 'type', value: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export const PairingStep = ({
  pairings,
  onAddPairing,
  onRemovePairing,
  onUpdatePairing,
  onContinue,
  onSkip
}: PairingStepProps) => (
  <div className="flex flex-col items-center gap-6 p-8">
    <h2 className="text-2xl font-semibold text-center">
      Perfect Pairings Make Perfect Moments 🍸
    </h2>
    <p className="text-center text-gray-400">
      What's complementing your cigar today?
    </p>
    
    <div className="w-full max-w-md space-y-4">
      {pairings.map((pairing, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 bg-[#2A2A2A] rounded-lg border border-white/10"
              value={pairing.name}
              onChange={(e) => onUpdatePairing(index, 'name', e.target.value)}
            />
            <Select
              value={pairing.type}
              onValueChange={(value) => onUpdatePairing(index, 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PAIRING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemovePairing(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        onClick={onAddPairing}
        className="w-full"
      >
        Add Pairing
      </Button>
    </div>

    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Button
        variant="default"
        onClick={onContinue}
        className="w-full"
      >
        Continue
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