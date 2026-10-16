import type { ApiListResponse, ApiResponse } from '@/shared/types/api';
import type { User } from '@/features/users/types';

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

export interface CreateCommentData {
  content: string;
  postId: string;
  authorId: string;
  authorName: string;
  parentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentWithAuthor extends Comment {
  author?: User;
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

export type CommentResponse = ApiResponse<Comment>;
export type CommentsResponse = ApiListResponse<Comment>;
