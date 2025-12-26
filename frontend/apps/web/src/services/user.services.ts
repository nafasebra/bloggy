import http from '@/lib/http';
import type { User, UpdateUserData } from '@/types';

export class UserService {
  static async getCurrentUser(token: string): Promise<User> {
    const response = await http.get<User>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async getAllUsers(): Promise<User[]> {
    const response = await http.get<User[]>('/users');
    return response.data;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await http.get<User>(`/users/${id}`);
    return response.data;
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await http.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await http.delete(`/users/${id}`);
  }
}
