import { useState } from "react";

interface cigarStrengthProps {
  strength: string;
  onChange: (value: string) => void;
}

const cigarStrengths = ["MILD", "MILD_MEDIUM", "MEDIUM", "MEDIUM_FULL", "FULL"];

export const CigarStrengthSelection = ({
  strength,
  onChange,
}: cigarStrengthProps) => (
  <section className="border border-white/10 rounded-lg p-4">
    <h3 className="text-lg pb-3 font-semibold">Strength</h3>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:justify-between">
      {cigarStrengths.map((cigarStrength, idx) => {
        return (
          <div
            key={idx}
            onClick={() => {
              onChange(cigarStrength);
            }}
            className={`p-2 rounded-lg cursor-pointer text-center text-sm md:text-base whitespace-nowrap ${
              strength === cigarStrength 
                ? "bg-[#EFA427] text-black" 
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {cigarStrength.replace("_", "-")}
          </div>
        );
      })}
    </div>
  </section>
);