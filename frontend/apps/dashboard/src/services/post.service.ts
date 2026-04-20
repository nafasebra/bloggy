import http from '@/lib/http';
import type { Post } from '@/types';

class PostService {
  async getAll(): Promise<Post[]> {
    const res = await http.get<Post[]>('/posts');
    return Array.isArray(res.data) ? res.data : [];
  }

  async getById(id: string): Promise<Post> {
    const res = await http.get<Post>(`/posts/${id}`);
    return res.data;
  }

  async create(data: Partial<Post>): Promise<Post> {
    const res = await http.post<Post>('/posts', data);
    return res.data;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const res = await http.patch<Post>(`/posts/${id}`, data);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await http.delete(`/posts/${id}`);
  }
}

export const postService = new PostService();
