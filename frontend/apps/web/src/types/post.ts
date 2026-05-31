import type { ApiListResponse, ApiResponse } from './api';
import type { Comment } from './comment';
import type { User } from './user';

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  authorId: string;
  authorName: string;
  views?: number;
  likes?: number;
  commentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface UpdatePostData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  updatedAt: string;
}

export const POST_CATEGORIES = [
  'Technology',
  'Lifestyle',
  'Food',
  'Travel',
  'Health',
  'Business',
  'Creative',
  'Education',
  'Entertainment',
  'Sports',
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export interface PostWithAuthor extends Post {
  author?: User;
}

export interface PostWithComments extends Post {
  comments?: Comment[];
}

export interface PostWithDetails extends Post {
  author?: User;
  comments?: Comment[];
  commentCount?: number;
}

export type PostResponse = ApiResponse<Post>;
export type PostsResponse = ApiListResponse<Post>;

export interface UserPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  views: number;
  likes: number;
}

export interface BlogPost {
  id: string | number;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorId: string | number;
  date: string | Date;
}
