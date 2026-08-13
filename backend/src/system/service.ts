import type { HealthResponseDto, LiveResponseDto, ReadyResponseDto, VersionResponseDto } from './dto';

export class SystemHealthService {
  public getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      version: this.getApplicationVersion(),
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV ?? 'development',
      database: 'ready',
      application: 'ready',
      service: 'ready',
    };
  }

  public getReady(): ReadyResponseDto {
    return {
      application: true,
      database: true,
      services: true,
      configuration: true,
    };
  }

  public getLive(): LiveResponseDto {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  public getVersion(): VersionResponseDto {
    return {
      applicationName: 'green-store-enterprise',
      version: this.getApplicationVersion(),
      buildNumber: process.env.BUILD_NUMBER ?? 'local',
      apiVersion: 'v1',
      buildDate: new Date().toISOString(),
    };
  }

  private getApplicationVersion(): string {
    return process.env.APP_VERSION ?? '0.0.0';
  }
}
