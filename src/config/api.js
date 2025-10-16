// API Configuration
// Uses Vite environment variables with VITE_ prefix

const config = {
  // Base API URL from environment variable or fallback
  baseURL: import.meta.env.VITE_API_BASE_URL,
  
  // API endpoints
  endpoints: {
    upload: '/api/analyze/upload',
    projects: (userId, limit = 50) => `/api/projects/${userId}?limit=${limit}`,
    projectDetails: (userId, projectId) => `/api/projects/${userId}/${projectId}`,
  },
  
  // Timeout configurations
  timeouts: {
    default: parseInt(import.meta.env.VITE_API_TIMEOUT) || 120000, // 2 minutes
    upload: parseInt(import.meta.env.VITE_API_UPLOAD_TIMEOUT) || 300000, // 5 minutes
  },
  
  // File upload limits
  upload: {
    maxContentLength: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 100 * 1024 * 1024, // 100MB
    maxBodyLength: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 100 * 1024 * 1024, // 100MB
  },
  
  // Default headers
  headers: {
    'Accept': 'application/json',
  },
  
  // CORS settings
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS === 'true' || false,
};

export default config;