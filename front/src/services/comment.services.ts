import http from '@/lib/http';
import type { Comment, CreateCommentData, UpdateCommentData } from '@/types';

export class CommentService {
  static async createComment(
    data: CreateCommentData,
    postId: string,
    accessToken: string | null
  ): Promise<Comment> {
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

  static async replyToComment(
    data: CreateCommentData,
    postId: string,
    accessToken: string | null
  ): Promise<Comment> {
    const response = await http.put<Comment>(`/comments/reply/${postId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  static async toggleLikeComment(commentId: string): Promise<Comment> {
    const response = await http.put<Comment>(`/comments/${commentId}/like`);
    return response.data;
  }

  static async checkIfCommentLiked(commentId: string): Promise<{ isLiked: boolean }> {
    const response = await http.get<{ isLiked: boolean }>(`/comments/${commentId}/like`);
    return response.data;
  }
}
