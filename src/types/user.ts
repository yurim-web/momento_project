export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  createDate: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface CheckEmailResponse {
  email: string;
  exists: boolean;
}

export interface CheckPasswordResponse {
  password: string;
  result: string;
}
