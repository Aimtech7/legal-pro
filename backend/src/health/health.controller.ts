import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Health')
@Controller('api')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth(): Promise<ApiResponseDto> {
    const healthData = await this.healthService.getHealthStatus();
    return new ApiResponseDto(true, 'Server is running', healthData);
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async getReadiness(): Promise<ApiResponseDto> {
    const readinessData = await this.healthService.getReadinessStatus();
    return new ApiResponseDto(true, 'Server is ready', readinessData);
  }
}