import { ReviewResponse } from "@/hooks/useReviewOperations";

interface ReviewWithFlavorScores {
  flavorPepperScore: number;
  flavorChocolateScore: number;
  flavorCreamyScore: number;
  flavorLeatherScore: number;
  flavorWoodyScore: number;
  flavorEarthyScore: number;
  flavorNuttyScore: number;
  flavorSweetScore: number;
  flavorFruityScore: number;
  flavorGrassyScore: number;
  flavorBerryScore: number;
  flavorCoffeeScore: number;
  flavorBittersScore: number;
}

export const formatReviewData = (review: any): ReviewResponse | undefined => {
  if (!review) return undefined;

  const hasFlavorScores = (review: any): review is ReviewWithFlavorScores => {
    return (
      'flavorPepperScore' in review &&
      'flavorChocolateScore' in review &&
      'flavorCreamyScore' in review &&
      'flavorLeatherScore' in review &&
      'flavorWoodyScore' in review &&
      'flavorEarthyScore' in review &&
      'flavorNuttyScore' in review &&
      'flavorSweetScore' in review &&
      'flavorFruityScore' in review &&
      'flavorGrassyScore' in review &&
      'flavorBerryScore' in review &&
      'flavorCoffeeScore' in review &&
      'flavorBittersScore' in review
    );
  };

  return {
    data: {},
    ...review,
    flavorPepperScore: hasFlavorScores(review) ? review.flavorPepperScore : 0,
    flavorChocolateScore: hasFlavorScores(review) ? review.flavorChocolateScore : 0,
    flavorCreamyScore: hasFlavorScores(review) ? review.flavorCreamyScore : 0,
    flavorLeatherScore: hasFlavorScores(review) ? review.flavorLeatherScore : 0,
    flavorWoodyScore: hasFlavorScores(review) ? review.flavorWoodyScore : 0,
    flavorEarthyScore: hasFlavorScores(review) ? review.flavorEarthyScore : 0,
    flavorNuttyScore: hasFlavorScores(review) ? review.flavorNuttyScore : 0,
    flavorSweetScore: hasFlavorScores(review) ? review.flavorSweetScore : 0,
    flavorFruityScore: hasFlavorScores(review) ? review.flavorFruityScore : 0,
    flavorGrassyScore: hasFlavorScores(review) ? review.flavorGrassyScore : 0,
    flavorBerryScore: hasFlavorScores(review) ? review.flavorBerryScore : 0,
    flavorCoffeeScore: hasFlavorScores(review) ? review.flavorCoffeeScore : 0,
    flavorBittersScore: hasFlavorScores(review) ? review.flavorBittersScore : 0,
    cigar: {
      id: review.cigar.id,
      name: review.cigar.name,
      brand: review.cigar.brand.name,
    },
    user: {
      id: review?.user?.id,
      fullName: review?.user?.fullName,
      profileImageUrl: review?.user?.profileImageUrl,
    },
  };
};