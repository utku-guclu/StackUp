import axios from 'axios';
import { RegisterRequest, RegisterResponse } from './types';
import { API_CONFIG } from '../../config/api';

export const register = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    console.log('Attempting to register with URL:', `${API_CONFIG.BASE_URL}/api/auth/register`);
    const response = await axios.post<RegisterResponse>(`${API_CONFIG.BASE_URL}/api/auth/register`, registerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up request');
      }
    }
    throw error;
  }
};
