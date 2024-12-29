// types/comment.ts
export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    parentId: number | null;
    user: {
      id: number;
      fullName: string;
      profileImageUrl: string;
    };
    replies: Comment[];
  }