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
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role?: string;
}

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
