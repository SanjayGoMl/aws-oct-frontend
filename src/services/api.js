import axios from 'axios';
import config from '../config/api.js';

const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeouts.default,
  headers: config.headers,
  withCredentials: config.withCredentials,
});

export const newsAPI = {
  // Upload files and create news analysis
  uploadFiles: async (formData) => {
    try {
      const response = await api.post(config.endpoints.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: config.timeouts.upload,
        maxContentLength: config.upload.maxContentLength,
        maxBodyLength: config.upload.maxBodyLength,
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
      const response = await api.get(config.endpoints.projects(userId, limit));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Get detailed project information
  getProjectDetails: async (userId, projectId) => {
    try {
      const response = await api.get(config.endpoints.projectDetails(userId, projectId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
};

export default api;