import axios from 'axios';
import { RegisterRequest, RegisterResponse } from './types';
import { API_CONFIG, checkApiConnection } from '../../config/api';

export const register = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    // Check API connection before making the request
    const isApiReachable = await checkApiConnection();
    if (!isApiReachable) {
      throw new Error('API is not reachable. Please check your backend server.');
    }

    console.log('Attempting to register with URL:', `${API_CONFIG.BASE_URL}/api/auth/register`);
    const response = await axios.post<RegisterResponse>(`${API_CONFIG.BASE_URL}/api/auth/register`, registerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        return { message: error.response.data.message || 'Registration failed', ok: false };
      } else if (error.request) {
        console.error('No response received:', error.request);
        return { message: 'No response received from server. Please check if the backend is running.', ok: false };
      } else {
        console.error('Error setting up request:', error.message);
        return { message: 'Error setting up request. Please check your network connection.', ok: false };
      }
    }
    return { message: 'An unexpected error occurred', ok: false };
  }
};
