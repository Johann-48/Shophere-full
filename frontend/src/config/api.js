// API configuration for handling different environments
const API_CONFIG = {
  // Use environment variable if available, otherwise detect based on hostname
  baseURL: import.meta.env.VITE_API_BASE_URL || 
           (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
             ? 'http://localhost:4000' 
             : ''),
  
  // For development
  isDevelopment: import.meta.env.DEV || false,
  
  // Construct full API URL
  getApiUrl: (endpoint) => {
    const baseURL = API_CONFIG.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    if (baseURL) {
      return `${baseURL}${cleanEndpoint}`;
    }
    return cleanEndpoint; // Relative path for production
  }
};

export default API_CONFIG;