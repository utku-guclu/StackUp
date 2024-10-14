import { register } from '../auth';
import { RegisterRequest, RegisterResponse } from '../types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Service - Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const mockRegisterRequest: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse: RegisterResponse = {
      message: 'User registered successfully',
      ok: true
    };

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await register(mockRegisterRequest);

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', mockRegisterRequest);
  });

  it('should handle registration failure', async () => {
    const mockRegisterRequest: RegisterRequest = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    };

    const mockError = {
      response: {
        data: {
          message: 'Username or email already exists',
          ok: false
        }
      }
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(register(mockRegisterRequest)).rejects.toThrow('Username or email already exists');
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', mockRegisterRequest);
  });
});
