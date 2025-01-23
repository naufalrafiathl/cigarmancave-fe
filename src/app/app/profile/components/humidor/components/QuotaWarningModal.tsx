import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuotaWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
}

export const QuotaWarningModal = ({ isOpen, onClose, remaining }: QuotaWarningModalProps) => {
  return (
<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[500px] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-[#EFA427] text-2xl">
            Import Quota Exceeded
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-white/80">
            You've reached your monthly import quota limit.
          </p>
          <p className="text-white/60">
            Don't worry, you can always use manual import. Also, this is our beta version so we might optimize this feature even more on full release to have it able to scan more cigars in one image, much faster optimized processing, and much more quota each month.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-[#EFA427] text-black hover:bg-[#E25931] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};