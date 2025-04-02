import supertest from 'supertest';
import { loadApp } from '../../main';

let app;
let request;

beforeAll(async () => {
  app = await loadApp();
  request = supertest(app);
});

afterAll(async () => {});

describe('API Auth Endpoint', () => {
  describe('POST /api/auth', () => {
    it('should authenticate admin user', async () => {
      const authRes = await request.post('/api/auth/login').send({
        username: 'admin', // credentials defined by env vars
        password: 'admin', // credentials defined by env vars
      });

      expect(authRes.status).toBe(200);
      expect(authRes.body.token).toBeDefined();
    });
    it('should rejects unauthenticated if credentials doesn`t match', async () => {
      const authRes = await request.post('/api/auth/login').send({
        username: 'other',
        password: 'other',
      });

      expect(authRes.status).toBe(401);
    });
  });
});
