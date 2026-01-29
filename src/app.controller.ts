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

  @Post('healthz')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  healthzPost(): void {
    throw new MethodNotAllowedException();
  }

  @Put('healthz')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  healthzPut(): void {
    throw new MethodNotAllowedException();
  }

  @Delete('healthz')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  healthzDelete(): void {
    throw new MethodNotAllowedException();
  }

  @Patch('healthz')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  healthzPatch(): void {
    throw new MethodNotAllowedException();
  }
}
