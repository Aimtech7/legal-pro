import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { HealthService } from '../health.service';

describe('HealthService', () => {
  let service: HealthService;
  let mockConnection: any;

  beforeEach(async () => {
    mockConnection = {
      readyState: 1,
      name: 'test-db',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    it('should return health status', async () => {
      const result = await service.getHealthStatus();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.environment).toBeDefined();
    });
  });

  describe('getReadinessStatus', () => {
    it('should return readiness status with connected database', async () => {
      const result = await service.getReadinessStatus();

      expect(result.status).toBe('ready');
      expect(result.database.status).toBe('connected');
      expect(result.database.name).toBe('test-db');
      expect(result.memory).toBeDefined();
    });

    it('should return disconnected status when database is not ready', async () => {
      mockConnection.readyState = 0;

      const result = await service.getReadinessStatus();

      expect(result.database.status).toBe('disconnected');
    });
  });
});