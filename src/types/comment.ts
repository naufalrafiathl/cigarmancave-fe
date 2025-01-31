export interface Comment {
    id: number;
    postId:number;
    content: string;
    createdAt: string;
    parentId: number | null;
    updatedAt: string;
    user: {
      id: number;
      fullName: string;
      profileImageUrl: string;
      isPremium: boolean;
    };
    replies: Comment[];
    userId: number;
  }