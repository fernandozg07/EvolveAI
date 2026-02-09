const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const api = {
  // Auth
  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // Profile
  getProfile: async () => {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  updateProfile: async (data: any) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Body Analysis
  uploadBodyPhotos: async (photos: { front?: File, back?: File, side?: File }) => {
    const formData = new FormData();
    if (photos.front) formData.append('front', photos.front);
    if (photos.back) formData.append('back', photos.back);
    if (photos.side) formData.append('side', photos.side);

    const res = await fetch(`${API_URL}/body-analysis`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    return res.json();
  },

  updateBodyAnalysis: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/body-analysis/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBodyAnalyses: async () => {
    const res = await fetch(`${API_URL}/body-analysis`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // Workouts
  getWorkouts: async () => {
    const res = await fetch(`${API_URL}/workouts`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  saveWorkout: async (data: any) => {
    const res = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Progress
  getProgress: async () => {
    const res = await fetch(`${API_URL}/progress`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  addProgress: async (data: any) => {
    const res = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

export default api;
