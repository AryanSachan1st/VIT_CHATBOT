// Utility functions for API calls

// Base API URL - will be set via environment variables in production
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    return { success: false, error: 'Network error occurred', status: 500 };
  }
};

// Authentication API calls
const authAPI = {
  login: async (email, password) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  },
  
  signup: async (name, email, password) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
  },
  
  verifyToken: async (token) => {
    return apiCall('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Chat API calls
const chatAPI = {
  query: async (token, query, userId, sessionId) => {
    return apiCall('/api/chat/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query, userId, sessionId })
    });
  }
};

// Blog API calls
const blogAPI = {
  getAll: async () => {
    return apiCall('/api/blogs');
  },
  
  getById: async (id) => {
    return apiCall(`/api/blogs/${id}`);
  }
};

export { API_BASE_URL, apiCall, authAPI, chatAPI, blogAPI };
