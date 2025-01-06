import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FlavorProfileProps {
  FirstThird: string[];
  SecondThird: string[];
  FinalThird: string[];
  isCollapsed: boolean;
  onToggle: () => void;
  onThirdChange: (third: 'FirstThird' | 'SecondThird' | 'FinalThird', flavors: string[]) => void;
}

const AVAILABLE_FLAVORS = [
  'Pepper', 'Chocolate', 'Creamy', 'Leather', 'Woody',
  'Earthy', 'Nutty', 'Sweet', 'Fruity', 'Grassy',
  'Berry', 'Coffee', 'Bitters'
];

export const FlavorProfile = ({
  FirstThird,
  SecondThird,
  FinalThird,
  isCollapsed,
  onToggle,
  onThirdChange
}: FlavorProfileProps) => {
  const [activeThird, setActiveThird] = useState<'FirstThird' | 'SecondThird' | 'FinalThird'>('FirstThird');

  const toggleFlavor = (third: 'FirstThird' | 'SecondThird' | 'FinalThird', flavor: string) => {
    const currentFlavors = third === 'FirstThird' ? FirstThird : 
                          third === 'SecondThird' ? SecondThird : FinalThird;
    
    const newFlavors = currentFlavors.includes(flavor)
      ? currentFlavors.filter(f => f !== flavor)
      : [...currentFlavors, flavor];
    
    onThirdChange(third, newFlavors);
  };

  return (
    <section className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-medium">Flavor Profile</h3>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Select flavors as they develop throughout your smoke, divided into three stages.
          </p>

          {/* Third selector container */}
          <div className="flex justify-center w-full mb-4">
            <div className="inline-flex items-center gap-2 p-1 bg-white/5 rounded-lg">
              {(['FirstThird', 'SecondThird', 'FinalThird'] as const).map((third) => (
                <button
                  key={third}
                  onClick={() => setActiveThird(third)}
                  className={`px-4 py-2 rounded-md transition-all text-sm ${
                    activeThird === third
                      ? 'bg-[#EFA427] text-gray-900 font-medium shadow-lg shadow-[#EFA427]/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  {third.replace('Third', ' Third')}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor tags grid */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {AVAILABLE_FLAVORS.map((flavor) => {
              const isSelected = (
                activeThird === 'FirstThird' ? FirstThird :
                activeThird === 'SecondThird' ? SecondThird :
                FinalThird
              ).includes(flavor);

              return (
                <button
                  key={flavor}
                  onClick={() => toggleFlavor(activeThird, flavor)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#EFA427] text-gray-900 font-medium shadow-md shadow-[#EFA427]/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                  }`}
                >
                  {flavor}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </section>
  );
};