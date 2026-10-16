export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
}

export interface ChangePasswordData {
  userId: string;
  old_password: string;
  new_password: string;
}
