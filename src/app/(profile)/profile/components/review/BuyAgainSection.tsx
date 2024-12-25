import React from 'react';
import { Button } from "@/components/ui/button";

interface BuyAgainSectionProps {
    value: boolean | null;
    onChange: (value: boolean) => void;
  }
  
  export const BuyAgainSection = ({ value, onChange }: BuyAgainSectionProps) => (
    <section className="border border-white/10 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Would you buy this cigar again?</h3>
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