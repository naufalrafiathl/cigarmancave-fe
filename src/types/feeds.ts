export interface User {
    id: number;
    fullName: string;
    profileImageUrl?: string;
  }
  
  export interface Like {
    createdAt: string;
    userId: number;
    postId: number;
    user: {
      id: number;
      fullName: string;
    };
  }
  
  export interface Review {
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
    notes: string;
    buyAgain: boolean;
    userId: number;
    cigarId: number;
  }
  
  export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    postId: number;
    parentId: number | null;
    user: User;
    replies: Comment[];
  }
  
  export interface Post {
    id: number;
    content: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
    userId: number;
    reviewId: number | null;
    user: User;
    images: any[];
    review?: Review;
    comments: Comment[];
    likes: Like[];
    _count: {
      comments: number;
      likes: number;
    };
  }
  
  export interface PostResponse {
    status: string;
    data: Post;
  }
  
  export interface CommentsResponse {
    status: string;
    data: {
      comments: Comment[];
      pagination: {
        total: number;
        pages: number;
        currentPage: number;
        perPage: number;
      };
    };
  }