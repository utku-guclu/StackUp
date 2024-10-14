import request from 'supertest';
import app from '../app.js';
import { sequelizeUsers } from '../database/db.js';
import UserModel from '../models/UserModel.js';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await sequelizeUsers.sync({ force: true });
  });

  afterAll(async () => {
    await sequelizeUsers.close();
  });

  beforeEach(async () => {
    await UserModel.destroy({ where: {} });
  });

  test('POST /api/auth/register should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User Created');
    expect(response.body).toHaveProperty('ok', true);
  });

  test('POST /api/auth/login should return a token for valid credentials', async () => {
    // First, create a user
    await UserModel.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword', // In reality, this should be hashed
      salt: 'salt'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('ok', true);
  });
});
