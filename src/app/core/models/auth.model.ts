export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    status: string;
    email: string;
    role: string;
  };
}