import axios from 'axios';

const BASE_URL = 'http://54.144.102.147:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Increased timeout for file uploads
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials to avoid CORS issues
});

export const newsAPI = {
  // Upload files and create news analysis
  uploadFiles: async (formData) => {
    try {
      const response = await api.post('/api/analyze/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 300000, // 5 minutes for large file uploads
        maxContentLength: 100 * 1024 * 1024, // 100MB
        maxBodyLength: 100 * 1024 * 1024, // 100MB
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || `Upload failed: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach server');
      } else {
        throw new Error(error.message || 'Upload failed');
      }
    }
  },

  // Get all projects for a user
  getUserProjects: async (userId, limit = 50) => {
    try {
      const response = await api.get(`/api/projects/${userId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Get detailed project information
  getProjectDetails: async (userId, projectId) => {
    try {
      const response = await api.get(`/api/projects/${userId}/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
};

export default api;