interface PostImage {
    url: string;
  }
  
import { useState,useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PostImage {
  id: number;
  url: string;
}

interface ImageCarouselProps {
  images: PostImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const nextSlide = (e?: React.MouseEvent): void => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e?: React.MouseEvent): void => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isModalOpen) {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsModalOpen(false);
    }
  };

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const ImageModal = () => {
    if (!isModalOpen) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/90 z-10 flex items-center justify-center"
        onClick={() => setIsModalOpen(false)}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={images[currentIndex].url}
            alt={`Full size image ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            width={1920}
            height={1080}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full
              hover:bg-black/70 transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full
              hover:bg-black/70 transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  };

  // Main carousel
  return (
    <>
      <div className="relative w-full my-4 z-10 overflow-hidden">
        <div 
          className="relative w-full aspect-[16/9] max-h-[600px] overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Blur container */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-[-10px] blur-2xl scale-110"
              style={{
                backgroundImage: `url(${images[currentIndex].url})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                opacity: 0.5,
              }}
            />
          </div>
          {/* Main image */}
          <div className="relative h-full flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={`Post image ${currentIndex + 1}`}
              fill
              className="object-contain -z-0"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={currentIndex === 0}
            />
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full
              hover:bg-black/70 transition-colors duration-200 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full
              hover:bg-black/70 transition-colors duration-200 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Pagination dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 
                ${currentIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageModal />
    </>
  );
};

export default ImageCarousel;