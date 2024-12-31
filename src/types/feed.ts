import { Comment } from "./comment";

export interface Post {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    reviewId?: number;
    user: {
      id: number;
      fullName: string;
      profileImageUrl: string;
    };
    review?: {
      id: number;
      createdAt: string;  
      updatedAt: string; 
      date: string;
      duration: number;
      price: number | null;  
      strength: string;    
      constructionScore: number;
      drawScore: number;
      flavorScore: number;
      burnScore: number;
      impressionScore: number;
      overallScore: number;
      notes: string;
      buyAgain: boolean;   
      userId: number;    
      cigarId: number;     
      images: any[];
      cigar: {
        id: number;
        name: string;
        brand: {
          id: number;
          name: string;
        };
      };
      pairings: Array<{
        id: number;
        reviewId: number;    
        pairingId: number;
        notes: string | null;
        pairing: {
          id: number;
          name: string;
          type: string;
        };
      }>;
    };
    comments: Comment[]
    images: Array<{   
      id: number;
      url: string;
    }>;
    likes: Array<{
      user: {
        id: number;
        fullName: string;
      };
    }>;
    engagement: {
      totalLikes: number;
      totalComments: number;
      totalEngagement: number;
      hasMoreComments: boolean;
    };
    _count?: {
      likes: number;
      comments: number;
    };
}
  
