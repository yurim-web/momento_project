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
  status: string;
  message: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface SignupResponse {
  status: string;
  message: string;
}

export interface CheckEmailResponse {
  email: string;
  exists: boolean;
}

export interface CheckPasswordResponse {
  password: string;
  result: string;
}
