import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  CheckEmailResponse,
  CheckPasswordResponse
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    cache: 'no-store',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// ============ User API ============
export const userApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    fetchApi('/user/login', { method: 'POST', body: JSON.stringify(data) }),

  signup: (data: SignupRequest): Promise<SignupResponse> =>
    fetchApi('/user/signup', { method: 'POST', body: JSON.stringify(data) }),

  checkEmail: (email: string): Promise<CheckEmailResponse> =>
    fetchApi(`/user/check-email?email=${encodeURIComponent(email)}`),

  checkPassword: (password: string): Promise<CheckPasswordResponse> =>
    fetchApi(`/user/check-password?password=${encodeURIComponent(password)}`),
};

// ============ Post API ============
export interface PostData {
  id?: number;
  title: string;
  content: string;
  category: string;
  location?: string;
  eventDate?: string;
  authorEmail: string;
  authorName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentData {
  id?: number;
  postId?: number;
  content: string;
  authorEmail: string;
  authorName: string;
  createdAt?: string;
}

export const postApi = {
  getAll: (category?: string): Promise<PostData[]> =>
    fetchApi(category ? `/api/posts?category=${encodeURIComponent(category)}` : '/api/posts'),

  getById: (id: number): Promise<PostData> =>
    fetchApi(`/api/posts/${id}`),

  create: (data: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostData> =>
    fetchApi('/api/posts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<PostData>): Promise<PostData> =>
    fetchApi(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/api/posts/${id}`, { method: 'DELETE' }),

  getComments: (postId: number): Promise<CommentData[]> =>
    fetchApi(`/api/posts/${postId}/comments`),

  createComment: (postId: number, data: Omit<CommentData, 'id' | 'postId' | 'createdAt'>): Promise<CommentData> =>
    fetchApi(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  deleteComment: (commentId: number): Promise<void> =>
    fetchApi(`/api/posts/comments/${commentId}`, { method: 'DELETE' }),
};

// ============ Diary API ============
export interface DiaryData {
  id?: number;
  title: string;
  content: string;
  mood: string;
  diaryDate: string;
  authorEmail: string;
  authorName: string;
  isShared: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const diaryApi = {
  getAll: (authorEmail?: string): Promise<DiaryData[]> =>
    fetchApi(authorEmail ? `/api/diaries?authorEmail=${encodeURIComponent(authorEmail)}` : '/api/diaries'),

  getById: (id: number): Promise<DiaryData> =>
    fetchApi(`/api/diaries/${id}`),

  create: (data: Omit<DiaryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryData> =>
    fetchApi('/api/diaries', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<DiaryData>): Promise<DiaryData> =>
    fetchApi(`/api/diaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/api/diaries/${id}`, { method: 'DELETE' }),
};

// ============ Calendar API ============
export interface CalendarEventData {
  id?: number;
  title: string;
  category: string;
  eventDate: string;
  authorEmail?: string;
  createdAt?: string;
}

export const calendarApi = {
  getByMonth: (year: number, month: number): Promise<CalendarEventData[]> =>
    fetchApi(`/api/calendar?year=${year}&month=${month}`),

  getByDate: (date: string): Promise<CalendarEventData[]> =>
    fetchApi(`/api/calendar/date?date=${date}`),

  create: (data: Omit<CalendarEventData, 'id' | 'createdAt'>): Promise<CalendarEventData> =>
    fetchApi('/api/calendar', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/api/calendar/${id}`, { method: 'DELETE' }),
};

// ============ Anniversary API ============
export interface AnniversaryData {
  id?: number;
  title: string;
  anniversaryDate: string;
  emoji: string;
  authorEmail?: string;
  createdAt?: string;
}

export const anniversaryApi = {
  getAll: (): Promise<AnniversaryData[]> =>
    fetchApi('/api/anniversaries'),

  create: (data: Omit<AnniversaryData, 'id' | 'createdAt'>): Promise<AnniversaryData> =>
    fetchApi('/api/anniversaries', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/api/anniversaries/${id}`, { method: 'DELETE' }),
};

// ============ Couple API ============
export interface CoupleLinkData {
  id?: number;
  inviteCode: string;
  ownerEmail: string;
  partnerEmail?: string;
  connected: boolean;
  createdAt?: string;
  connectedAt?: string;
}

export const coupleApi = {
  generateCode: (email: string): Promise<CoupleLinkData> =>
    fetchApi('/api/couple/generate', { method: 'POST', body: JSON.stringify({ email }) }),

  connect: (inviteCode: string, email: string): Promise<CoupleLinkData> =>
    fetchApi('/api/couple/connect', { method: 'POST', body: JSON.stringify({ inviteCode, email }) }),

  getStatus: (email: string): Promise<CoupleLinkData & { connected: boolean }> =>
    fetchApi(`/api/couple/status?email=${encodeURIComponent(email)}`),
};

// ============ Gallery API ============
export interface GalleryData {
  id?: number;
  fileName: string;
  originalName: string;
  imageUrl: string;
  caption?: string;
  authorEmail?: string;
  createdAt?: string;
}

export const galleryApi = {
  getAll: (): Promise<GalleryData[]> =>
    fetchApi('/api/gallery'),

  upload: async (file: File, caption: string, authorEmail: string): Promise<GalleryData> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('authorEmail', authorEmail);
    const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  delete: (id: number): Promise<void> =>
    fetchApi(`/api/gallery/${id}`, { method: 'DELETE' }),
};
