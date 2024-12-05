// src/features/humidor/components/CreateHumidorModal.tsx
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateHumidorModalProps {
  onSubmit: (data: { name: string; description: string; imageUrl?: string; }) => Promise<void>;
  onClose: () => void;
}

export function CreateHumidorModal({ onSubmit, onClose }: CreateHumidorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      setFormData({ name: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('Failed to create humidor:', error);
    }
  };

  return (
    <DialogContent className="bg-[#222222] text-white border-white/10 w-[90vw] max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>Create New Humidor</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="My Humidor"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="Daily smokes collection..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="bg-[#2A2A2A] border-white/10 text-white"
            placeholder="https://..."
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#EFA427] rounded-lg hover:bg-[#d89421] transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </DialogContent>
  );
}