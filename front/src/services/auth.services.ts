import http from '@/lib/http';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  RefreshTokenData,
  ChangePasswordData 
} from '@/types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  static async refreshToken(data: RefreshTokenData): Promise<{ access_token: string }> {
    const response = await http.post<{ access_token: string }>('/auth/refresh', data);
    return response.data;
  }

  static async changePassword(data: ChangePasswordData): Promise<void> {
    await http.post('/auth/change-password', data);
  }

  static async forgotPassword(email: string): Promise<void> {
    await http.post('/auth/forgot-password', { email });
  }
}
