import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:4040',
};

console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

// Function to check if the API is reachable
export const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api`);
    console.log('API is reachable');
    return true;
  } catch (error) {
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
