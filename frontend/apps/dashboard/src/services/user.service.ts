import http from '@/lib/http';
import type { User } from '@/types';

class UserService {
  async getAll(): Promise<User[]> {
    const res = await http.get<User[]>('/users');
    return Array.isArray(res.data) ? res.data : [];
  }

  async getById(id: string): Promise<User> {
    const res = await http.get<User>(`/users/${id}`);
    return res.data;
  }

  async create(data: Partial<User>): Promise<User> {
    const res = await http.post<User>('/users', data);
    return res.data;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const res = await http.patch<User>(`/users/${id}`, data);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await http.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
