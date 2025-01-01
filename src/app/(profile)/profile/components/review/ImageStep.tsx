import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageStepProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
}

export const ImageStep = ({ onImageUpload, onSkip }: ImageStepProps) => (
  <div className="flex flex-col items-center gap-6 p-8">
    <Camera className="w-16 h-16 text-[#EFA427]" />
    <h2 className="text-2xl font-semibold text-center">
      Capture the Moment
    </h2>
    <p className="text-center text-gray-400">
      Let's preserve this masterpiece before the experience begins.
    </p>
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <input
        type="file"
        accept="image/*"
        id="cigar-image"
        className="hidden"
        onChange={onImageUpload}
      />
      <label
        htmlFor="cigar-image"
        className="w-full px-6 py-3 bg-[#EFA427] text-white rounded-lg cursor-pointer hover:bg-[#EFA427]/90 transition-colors text-center font-medium"
      >
        Take Photo
      </label>
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