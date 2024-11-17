import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface NewHumidorCardProps {
  viewMode?: 'grid' | 'list';
}

export function NewHumidorCard({ viewMode = 'grid' }: NewHumidorCardProps) {
  if (viewMode === 'list') {
    return (
      <DialogTrigger asChild>
        <div className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10 border-dashed">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFA427] flex items-center justify-center">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Add New Humidor
                </h3>
                <p className="text-[#B9B9B9] text-sm">
                  Create a new collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
    );
  }

  return (
    <DialogTrigger asChild>
      <div className="bg-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:bg-[#333333] transition-colors border border-white/10 border-dashed flex flex-col items-center justify-center aspect-square">
        <div className="w-12 h-12 rounded-full bg-[#EFA427] flex items-center justify-center mb-3">
          <Plus className="text-white" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-white text-center">
          Add New Humidor
        </h3>
        <p className="text-[#B9B9B9] text-sm text-center mt-1">
          Create a new collection
        </p>
      </div>
    </DialogTrigger>
  );
}