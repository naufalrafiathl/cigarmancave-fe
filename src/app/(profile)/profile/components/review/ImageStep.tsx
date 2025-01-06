import React, {useState} from 'react';
import { Camera, Upload, Trash } from 'lucide-react';
import Image from 'next/image';
import { validateFile } from '@/utils/validateFIle';
import { toast } from "sonner";

interface ImageStepProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
}

export const ImageStep: React.FC<ImageStepProps> = ({
  onImageUpload,
  onSkip,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onImageUpload(e);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Invalid file");
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
  };

  return (
    <div className="py-4 text-center">
      <h3 className="text-lg font-medium mb-2">Capture the moment.</h3>
      <p className="text-sm text-gray-400 mb-4">
        Take a photo of your cigar to enhance your review
      </p>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Cigar preview"
              fill
              className="rounded-xl object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-[#363636] flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#B9B9B9]" />
            </div>
          )}

          <div className="absolute -bottom-2 -right-2 flex gap-2">
            <label
              htmlFor="review-image"
              className="w-8 h-8 bg-[#EFA427] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#EFA427]/90 transition-colors"
            >
              <Upload className="w-4 h-4 text-white" />
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Trash className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        <input
          id="review-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="text-sm text-[#B9B9B9]">
          Recommended: Square image, max 5MB
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onSkip}
          className="px-4 py-2 text-sm font-medium text-[#B9B9B9] bg-transparent border border-white/10 rounded-xl hover:bg-white/5"
        >
          Skip
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-sm font-medium text-black bg-[#EFA427] rounded-xl hover:bg-[#EFA427]/90"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};