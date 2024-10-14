export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4040',
};

console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

// Function to check if the API is reachable
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`);
    if (response.ok) {
      console.log('API is reachable');
      return true;
    } else {
      console.error('API is not responding correctly');
      return false;
    }
  } catch (error) {
    console.error('Error connecting to API:', error);
    return false;
  }
};
