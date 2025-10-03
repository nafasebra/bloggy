import http from '@/lib/http';

export interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export class UserService {
  static async getCurrentUser(): Promise<User> {
    const response = await http.get<User>('/users/me');
    return response.data;
  }

  static async getAllUsers(): Promise<User[]> {
    const response = await http.get<User[]>('/users');
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
