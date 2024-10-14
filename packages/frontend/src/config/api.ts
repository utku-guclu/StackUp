import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4040',
};

console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

// Function to check if the API is reachable
export const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/auth/register`);
    if (response.status === 404) {
      console.log('API is reachable');
      return true;
    } else {
      console.error('API is not responding correctly');
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      console.log('API is reachable');
      return true;
    }
    console.error('Error connecting to API:', error);
    return false;
  }
};

// Function to test the API
export const testApi = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api`);
    console.log('API test response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
};
