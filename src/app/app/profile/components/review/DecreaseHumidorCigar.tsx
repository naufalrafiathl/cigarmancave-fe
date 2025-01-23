import React from 'react';
import { Button } from "@/components/ui/button";

interface DecreaseHumidorCigarProps {
    value: boolean | null;
    onChange: (value: boolean) => void;
  }
  
  export const DecreaseHumidorCigar = ({ value, onChange }: DecreaseHumidorCigarProps) => (
    <section className="border border-white/10 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Would you like to decrease this cigar quantity from your humidor ?</h3>
      <div className="flex gap-4">
        <Button
          variant={value === true ? "default" : "outline"}
          onClick={() => onChange(true)}
        >
          Yes
        </Button>
        <Button
          variant={value === false ? "default" : "outline"}
          onClick={() => onChange(false)}
        >
          No
        </Button>
      </div>
    </section>
  );