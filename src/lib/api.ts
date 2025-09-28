import { 
  LoginRequest, 
  LoginResponse, 
  SignupRequest, 
  SignupResponse, 
  CheckEmailResponse, 
  CheckPasswordResponse 
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const userApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 이메일 중복 확인
  checkEmail: async (email: string): Promise<CheckEmailResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/check-email?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  // 비밀번호 유효성 검사
  checkPassword: async (password: string): Promise<CheckPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/check-password?password=${encodeURIComponent(password)}`);
    return response.json();
  },
};
