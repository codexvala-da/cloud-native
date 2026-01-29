import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  ServiceUnavailableException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): string {
    return 'Service is healthy';
  }

  @Get('healthz')
  @HttpCode(HttpStatus.OK)
  async healthz(): Promise<void> {
    const isHealthy = await this.appService.checkHealth();
    if (!isHealthy) {
      throw new ServiceUnavailableException();
    }
  }
}
