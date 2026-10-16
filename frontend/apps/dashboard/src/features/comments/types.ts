export interface Comment {
  _id: string;
  content: string;
  postId: string;
  authorId: string;
  authorName: string;
  likes?: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommentRow = Comment & { postTitle: string };
