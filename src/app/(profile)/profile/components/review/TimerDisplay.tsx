import React from 'react';
import { formatTime } from '@/lib/time';

interface TimerDisplayProps {
    time: number;
  }
  
  export const TimerDisplay = ({ time }: TimerDisplayProps) => (
    <div className="sticky z-50 top-0 right-0 bg-[#2A2A2A] mx-5 px-4 py-2 rounded-lg border border-white/10 mb-6 text-center">
      {formatTime(time)}
    </div>
  );