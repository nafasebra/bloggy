// ==================== Post Types ====================

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

// ==================== Notification Types ====================

export interface Notification {
  _id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment';
  relatedUserId: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  relatedPostId?: {
    _id: string;
    title: string;
  };
  relatedCommentId?: {
    _id: string;
    content: string;
  };
  read: boolean;
  message: string;
  link?: string;
  createdAt: string;
  updatedAt?: string;
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

// ==================== User Types ====================

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  twitter?: string;
  followers?: number;
  following?: number;
  category: string;
  postIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  twitter?: string;
  category?: string;
}

// ==================== Comment Types ====================

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

// ==================== API Response Types ====================

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  total: number;
  pagination?: Pagination;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error?: string;
}

// ==================== Specific Response Types ====================

export type PostResponse = ApiResponse<Post>;
export type PostsResponse = ApiListResponse<Post>;
export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiListResponse<User>;
export type CommentResponse = ApiResponse<Comment>;
export type CommentsResponse = ApiListResponse<Comment>;

// ==================== Auth Types ====================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
}

export interface RefreshTokenData {
  refresh_token: string;
}

export interface ChangePasswordData {
  userId: string;
  old_password: string;
  new_password: string;
}

// ==================== Category Constants ====================

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

// ==================== Extended Post Types with Relations ====================

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

// ==================== Comment with Relations ====================

export interface CommentWithAuthor extends Comment {
  author?: User;
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
}
