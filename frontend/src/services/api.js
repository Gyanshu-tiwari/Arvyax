const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  },

  // Get current user
  getMe: async () => {
    const response = await apiRequest('/auth/me');
    return response.data;
  },

  // Update user details
  updateDetails: async (userData) => {
    const response = await apiRequest('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await apiRequest('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    return response;
  },
};

// Sessions API
export const sessionsAPI = {
  // Get public sessions
  getPublicSessions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sessions${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  // Get user's sessions
  getUserSessions: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sessions/my-sessions${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  // Get single session
  getSession: async (sessionId) => {
    const response = await apiRequest(`/sessions/${sessionId}`);
    return response.data;
  },

  // Create new session
  createSession: async (sessionData) => {
    const response = await apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
    return response.data;
  },

  // Update session
  updateSession: async (sessionId, sessionData) => {
    const response = await apiRequest(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
    return response.data;
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const response = await apiRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return response;
  },

  // Save draft (create or update)
  saveDraft: async (sessionData, userId) => {
    const sessionWithUser = { ...sessionData, user: userId };
    const response = await apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionWithUser),
    });
    return response.data;
  },

  // Publish session
  publishSession: async (sessionId) => {
    const response = await apiRequest(`/sessions/${sessionId}/publish`, {
      method: 'PUT',
    });
    return response.data;
  },

  // Like/Unlike session
  likeSession: async (sessionId) => {
    const response = await apiRequest(`/sessions/${sessionId}/like`, {
      method: 'PUT',
    });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await apiRequest('/health');
    return response;
  },
}; 