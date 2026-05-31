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
