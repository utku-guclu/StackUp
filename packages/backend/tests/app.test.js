import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authenticationRoutes from '../routes/authenticationRoutes.js';
import accessControlRoutes from '../routes/authorisationRoutes.js';

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authenticationRoutes);
  app.use("/api", accessControlRoutes);
  app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });
  return app;
};

describe('GET /', () => {
  it('responds with a json message', async () => {
    const app = createApp();
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello from server!' });
  });
});
