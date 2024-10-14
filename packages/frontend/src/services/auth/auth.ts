import axios from 'axios';
import { RegisterRequest, RegisterResponse } from './types';

export const register = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>('/api/auth/register', registerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred during registration');
  }
};
