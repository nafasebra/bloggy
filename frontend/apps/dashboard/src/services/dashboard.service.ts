import http from '@/lib/http';
import type { DashboardStats, Post, User } from '@/types';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    // نکته: در حالت ایده‌آل باید یک اندپوینت در بکند داشته باشید:
    // const response = await http.get<DashboardStats>('/dashboard/stats');
    // return response.data;

    // منطق فعلی شما (برای سازگاری تا زمانی که بکند آپدیت شود):
    const [postsRes, usersRes] = await Promise.all([
      http.get<Post[]>('/posts'),
      http.get<User[]>('/users'),
    ]);

    const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
    const users = Array.isArray(usersRes.data) ? usersRes.data : [];

    let totalComments = 0;

    // هشدار پرفورمنس: این بخش در آینده باید در بکند با Aggregation جایگزین شود
    if (posts.length > 0) {
      const commentResponses = await Promise.all(
        posts.map((post) => http.get<unknown[]>(`/comments/${post._id}`))
      );
      totalComments = commentResponses.reduce(
        (sum, res) => sum + (Array.isArray(res.data) ? res.data.length : 0),
        0
      );
    }

    return {
      posts: posts.length,
      users: users.length,
      comments: totalComments,
    };
  }
}

export const dashboardService = new DashboardService();
