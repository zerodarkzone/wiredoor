import { loadApp } from '../main';
import supertest from 'supertest';
import {
  mockGenPrivateKey,
  mockGenPublicKey,
  mockQuickUp,
  mockSaveToFile,
} from './.jest/global-mocks';

let app;
let request;

beforeAll(async () => {
  app = await loadApp();
  request = supertest(app);
});

afterAll(async () => {});

describe('main', () => {
  describe('DB Initialization', () => {
    it('should initialize database and configuration data', async () => {
      expect(mockGenPrivateKey).toHaveBeenCalled();
      expect(mockGenPublicKey).toHaveBeenCalledWith('private_key');
    });
  });
  describe('VPN Initialization', () => {
    it('should re-generate or initialize vpn config', async () => {
      expect(mockSaveToFile).toHaveBeenCalledWith(
        '/etc/wireguard/wg0.conf',
        expect.any(String),
        'utf-8',
        0o600,
      );
      expect(mockQuickUp).toHaveBeenCalled();
    });
  });
  describe('API Home', () => {
    describe('GET /', () => {
      it('should response with a 200 status code', async () => {
        const response = await request.get('/').send();
        expect(response.statusCode).toBe(200);
        // expect(response.text).toContain(config.app.name);
      });
    });
  });
});
