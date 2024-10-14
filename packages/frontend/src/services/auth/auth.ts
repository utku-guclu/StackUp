import axios from 'axios';
import { RegisterRequest, RegisterResponse } from './types';
import { API_CONFIG } from '../../config/api';

export const register = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_CONFIG.BASE_URL}/api/auth/register`, registerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw error;
  }
};
