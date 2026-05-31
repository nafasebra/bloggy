import http from '@/lib/http';
import type { Comment, CommentRow, Post } from '@/types';

class CommentService {
  async getAllCommentsWithPostTitles(): Promise<CommentRow[]> {
    // دریافت تمام پست‌ها
    const postsRes = await http.get<Post[]>('/posts');
    const posts = Array.isArray(postsRes.data) ? postsRes.data : [];

    if (!posts.length) return [];

    // دریافت کامنت‌های هر پست
    const commentResponses = await Promise.all(
      posts.map((post) => http.get<Comment[]>(`/comments/${post._id}`))
    );

    // ترکیب داده‌ها
    const rows: CommentRow[] = [];
    posts.forEach((post, index) => {
      const postComments = Array.isArray(commentResponses[index].data)
        ? commentResponses[index].data
        : [];

      postComments.forEach((comment) => {
        rows.push({
          ...comment,
          postTitle: post.title,
        });
      });
    });

    // مرتب‌سازی بر اساس تاریخ (جدیدترین‌ها اول)
    return rows.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteComment(id: string): Promise<void> {
    await http.delete(`/comments/${id}`);
  }
}

export const commentService = new CommentService();
