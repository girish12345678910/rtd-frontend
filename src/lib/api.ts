import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get Clerk session token
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Failed to get token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors - DON'T redirect automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    // Don't redirect, just return the error
    return Promise.reject(error);
  }
);

// API methods
export const teamApi = {
  getAll: () => api.get('/teams'),
  getOne: (id: string) => api.get(`/teams/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/teams', data),
  update: (id: string, data: { name?: string; description?: string }) => 
    api.patch(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
  addMember: (id: string, data: { email: string; role: string }) => 
    api.post(`/teams/${id}/members`, data),
  removeMember: (id: string, userId: string) => 
    api.delete(`/teams/${id}/members/${userId}`),
};

export const sessionApi = {
  getAll: (teamId?: string) => api.get('/sessions', { params: { teamId } }),
  getOne: (id: string) => api.get(`/sessions/${id}`),
  create: (data: { teamId: string; title: string; description?: string }) => 
    api.post('/sessions', data),
  close: (id: string) => api.post(`/sessions/${id}/close`),
  createTopic: (data: { sessionId: string; title: string; description?: string }) =>
    api.post('/sessions/topics', data),
  sendMessage: (data: { sessionId: string; content: string }) =>
    api.post('/sessions/messages', data),
};


export const voteApi = {
  cast: (data: { topicId: string; choice: 'YES' | 'NO' | 'ABSTAIN' }) => 
    api.post('/votes', data),
  retract: (id: string) => api.delete(`/votes/${id}`),
  getResults: (topicId: string) => api.get(`/votes/results/${topicId}`),
};

export const authApi = {
  sync: () => api.post('/auth/sync'),
};
