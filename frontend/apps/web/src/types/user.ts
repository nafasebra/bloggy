import type { ApiListResponse, ApiResponse } from './api';

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

export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiListResponse<User>;
