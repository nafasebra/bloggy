import http from '@/lib/http';
import type { Post, CreatePostData, UpdatePostData } from '@/types';

export class PostService {
  static async createPost(
    data: CreatePostData,
    accessToken: string | null
  ): Promise<Post> {
    const response = await http.post<Post>('/posts', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  static async searchPosts(query: string): Promise<Post[]> {
    const response = await http.get<Post[]>('/posts/search', {
      params: { query },
    });
    return response.data;
  }

  static async getAllPosts(): Promise<Post[]> {
    const response = await http.get<Post[]>('/posts');
    return response.data;
  }

  static async getPostById(id: string): Promise<Post> {
    const response = await http.get<Post>(`/posts/${id}`);
    return response.data;
  }

  static async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    const response = await http.put<Post>(`/posts/${id}`, data);
    return response.data;
  }

  static async deletePost(id: string): Promise<void> {
    await http.delete(`/posts/${id}`);
  }

  static async getPostsByUserId(userId: string): Promise<Post[]> {
    const response = await http.get<Post[]>(`/posts/user/${userId}`);
    return response.data;
  }

  static async toggleLikePost(id: string): Promise<{ post: Post; isLiked: boolean; action: 'liked' | 'unliked'; message: string }> {
    const response = await http.post<{ post: Post; isLiked: boolean; action: 'liked' | 'unliked'; message: string }>(`/posts/${id}/like`);
    return response.data;
  }

  static async checkIfPostLiked(id: string): Promise<{ isLiked: boolean }> {
    const response = await http.get<{ isLiked: boolean }>(`/posts/${id}/liked`);
    return response.data;
  }

  static async viewPost(id: string): Promise<{ post: Post; isNewView: boolean; message: string }> {
    const response = await http.post<{ post: Post; isNewView: boolean; message: string }>(`/posts/${id}/view`);
    return response.data;
  }
}
