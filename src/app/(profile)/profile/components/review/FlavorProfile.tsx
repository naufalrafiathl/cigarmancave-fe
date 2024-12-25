// components/review/sections/FlavorProfile.tsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface FlavorProfileProps {
  profiles: Record<string, number>;
  isCollapsed: boolean;
  onToggle: () => void;
  onProfileChange: (key: string, value: number) => void;
}

export const FlavorProfile = ({
  profiles,
  isCollapsed,
  onToggle,
  onProfileChange
}: FlavorProfileProps) => {
  const getFlavorLabel = (key: string) => {
    return key
      .replace('flavor', '')
      .replace('Score', '')
      .split(/(?=[A-Z])/)
      .join(' ')
      .trim();
  };

  return (
    <section className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5"
      >
        <h3 className="text-lg font-semibold">Flavor Profile</h3>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 space-y-6">
          {Object.entries(profiles).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400">
                  {getFlavorLabel(key)}
                </label>
                <span className="text-sm text-gray-400">{value}/3</span>
              </div>
              <Slider
                value={[value]}
                min={0}
                max={3}
                step={1}
                onValueChange={([newValue]) => onProfileChange(key, newValue)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};