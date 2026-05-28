import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) - should validate required fields', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
      });
  });

  it('/api/auth/login (POST) - should validate email format', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'invalid-email',
        password: 'password123',
      })
      .expect(400);
  });

  it('/api/auth/login (POST) - should validate password length', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: '123',
      })
      .expect(400);
  });
});