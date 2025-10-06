import http from '@/lib/http';
import type { Comment, CreateCommentData, UpdateCommentData } from '@/types';

export class CommentService {
  static async createComment(data: CreateCommentData, postId: string, accessToken: string | null): Promise<Comment> {
    const response = await http.post<Comment>(`/comments/${postId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  static async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const response = await http.get<Comment[]>(`/comments/${postId}`);
    return response.data;
  }

  static async getCommentById(id: string): Promise<Comment> {
    const response = await http.get<Comment>(`/comments/${id}`);
    return response.data;
  }

  static async updateComment(id: string, data: UpdateCommentData): Promise<Comment> {
    const response = await http.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  }

  static async deleteComment(id: string): Promise<void> {
    await http.delete(`/comments/${id}`);
  }

  static async likeComment(id: string): Promise<Comment> {
    const response = await http.post<Comment>(`/comments/${id}/like`);
    return response.data;
  }

  static async replyToComment(id: string, data: CreateCommentData): Promise<Comment> {
    const response = await http.post<Comment>(`/comments/${id}/reply`, data);
    return response.data;
  }
}
