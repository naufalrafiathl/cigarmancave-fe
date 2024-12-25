import { Button } from "@/components/ui/button";

interface ManualDurationProps {
  duration: number;
  onChange: (value: number) => void;
}

export const ManualDuration = ({ duration, onChange }: ManualDurationProps) => (
  <section className="border border-white/10 rounded-lg p-4">
    <h3 className="text-lg font-semibold mb-4">Smoking Duration</h3>
    <div className="flex gap-4 items-center">
      <input
        type="number"
        value={duration}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="px-3 py-2 bg-[#2A2A2A] rounded-lg border border-white/10 w-24"
        min="0"
      />
      <span className="text-gray-400">minutes</span>
    </div>
  </section>
);