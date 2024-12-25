// components/review/sections/NotesSection.tsx
import React from 'react';
import { MessageCircle, MinusCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotesSectionProps {
  notes: string;
  showModal: boolean;
  isMinimized: boolean;
  onNotesChange: (value: string) => void;
  onToggleModal: (value: boolean) => void;
  onMinimize: () => void;
}

export const NotesSection = ({
  notes,
  showModal,
  isMinimized,
  onNotesChange,
  onToggleModal,
  onMinimize
}: NotesSectionProps) => {
  return (
    <>
      <div className="sticky bottom-4 right-4 flex justify-end">
        <button
          onClick={() => onToggleModal(true)}
          className={`bg-[#EFA427] text-white p-4 rounded-full shadow-lg hover:bg-[#EFA427]/90 transition-colors ${
            isMinimized ? 'opacity-50 hover:opacity-75' : ''
          }`}
          title={isMinimized ? "Continue writing notes" : "Add tasting notes"}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      <Dialog open={showModal} onOpenChange={onToggleModal}>
        <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[425px] border border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Tasting Notes</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onToggleModal(false);
                    onMinimize();
                  }}
                  title="Minimize"
                >
                  <MinusCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleModal(false)}
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Record your thoughts, flavors, and overall experience..."
              className="w-full h-48 p-3 bg-[#2A2A2A] rounded-lg border border-white/10 resize-none focus:outline-none focus:ring-2 focus:ring-[#EFA427] focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};